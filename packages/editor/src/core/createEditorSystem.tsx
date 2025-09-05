import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, PASTE_COMMAND, TextFormatType, $getSelection, $isRangeSelection, CAN_UNDO_COMMAND, CAN_REDO_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { EditorConfig, EditorContextType, Extension, ExtractCommands, ExtractPlugins, ExtractStateQueries, BaseCommands } from '@repo/editor/extensions/types';

interface ProviderProps<Exts extends readonly Extension[]> {
  children: ReactNode;
  config?: EditorConfig;
  extensions: Exts;
}

// Factory: Creates typed Provider/useEditor per Exts
export function createEditorSystem<Exts extends readonly Extension[]>() {
  const EditorContext = createContext<EditorContextType<Exts> | null>(null);

  function useEditor() {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error('useEditor must be used within Provider');
    return ctx;
  }

  function ProviderInner({ children, config = {}, extensions }: ProviderProps<Exts>) {
    const [editor] = useLexicalComposerContext();

    // Lazy commands from extensions + base
    const baseCommands: BaseCommands = {
      formatText: (format: TextFormatType, value?: boolean | string) => editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format),
    };
    const extensionCommands = useMemo(() => extensions.reduce((acc, ext) => ({ ...acc, ...ext.getCommands(editor!) }), {}), [extensions, editor]);
    const commands = { ...baseCommands, ...extensionCommands } as BaseCommands & ExtractCommands<Exts>;

    // Plugins: Collect inferred
    const plugins = useMemo(() => extensions.flatMap(ext => ext.getPlugins?.() || []), [extensions]);

    // Register extensions (this was missing!)
    useEffect(() => {
      if (!editor) return;
      const unregisters = extensions.map(ext => ext.register(editor));
      return () => unregisters.forEach(unreg => unreg && unreg());
    }, [editor, extensions]);

    // Collect state queries (now all Promise-based)
    const stateQueries = useMemo(() => extensions.reduce(
      (acc, ext) => ({
        ...acc,
        ...(ext.getStateQueries ? ext.getStateQueries(editor!) : {}),
      }),
      {} as Record<string, () => Promise<boolean>>
    ), [extensions, editor]);

    const hasHistory = useMemo(() => extensions.some(ext => ext.name === 'history'), [extensions]);

    // Batched active states
    const [activeStates, setActiveStates] = useState<ExtractStateQueries<Exts>>(() => {
      const obj: Record<string, boolean> = {};
      Object.keys(stateQueries).forEach(key => obj[key] = false);
      if (hasHistory) {
        obj.canUndo = false;
        obj.canRedo = false;
      }
      return obj as ExtractStateQueries<Exts>;
    });

    useEffect(() => {
      if (!editor) return;

      const unregister = editor.registerUpdateListener(() => {
        // No editorState.read() here—all queries handle their own reads if needed
        const promises = Object.entries(stateQueries).map(([key, queryFn]) =>
          queryFn().then((value) => [key, value] as [string, boolean])
        );

        Promise.all(promises).then((results) => {
          const newStates = Object.fromEntries(results);
          setActiveStates((prev) => ({ ...prev, ...newStates } as ExtractStateQueries<Exts>)); // Merge to avoid overwriting
        });
      });

      return unregister;
    }, [editor, stateQueries]);

    // Optional: Initial query on mount (to avoid undefined flash)
    useEffect(() => {
      if (!editor) return;

      const promises = Object.entries(stateQueries).map(([key, queryFn]) =>
        queryFn().then((value) => [key, value] as [string, boolean])
      );

      Promise.all(promises).then((results) => {
        const newStates = Object.fromEntries(results);
        if (hasHistory) {
          newStates.canUndo = false;
          newStates.canRedo = false;
        }
        setActiveStates(newStates as ExtractStateQueries<Exts>);
      });
    }, [editor, stateQueries, hasHistory]);

    // Event listeners for history states (if extension present)
    useEffect(() => {
      if (!editor || !hasHistory) return;

      const unregisterUndo = editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          setActiveStates((prev) => ({ ...prev, canUndo: payload } as ExtractStateQueries<Exts>));
          return false;
        },
        COMMAND_PRIORITY_LOW
      );

      const unregisterRedo = editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          setActiveStates((prev) => ({ ...prev, canRedo: payload } as ExtractStateQueries<Exts>));
          return false;
        },
        COMMAND_PRIORITY_LOW
      );

      return () => {
        unregisterUndo();
        unregisterRedo();
      };
    }, [editor, hasHistory]);

    const contextValue: EditorContextType<Exts> = {
      editor,
      config,
      extensions,
      commands,
      activeStates: activeStates as ExtractStateQueries<Exts>,
      listeners: {
        registerUpdate: (listener: (state: any) => void) => editor?.registerUpdateListener(listener) || (() => {}),
        registerPaste: (listener: (event: ClipboardEvent) => boolean) => editor?.registerCommand(PASTE_COMMAND, listener, 4) || (() => {}),
      },
      export: {
        toHTML: async () => '',
        toMarkdown: async () => '',
        toJSON: () => editor?.getEditorState().toJSON(),
      },
      import: {
        fromHTML: async () => {},
        fromMarkdown: async () => {},
        fromJSON: (json: any) => editor?.setEditorState(editor.parseEditorState(json)),
      },
      lexical: editor,
      extensionsAPI: {
        add: (ext: Extension) => {}, // TODO: Implement dynamic add
        remove: (name: string) => {},
        reorder: (names: string[]) => {},
      },
      plugins,
      hasExtension: (name: Exts[number]['name']) => extensions.some(ext => ext.name === name),
    };

    return <EditorContext.Provider value={contextValue}>{plugins}{children}</EditorContext.Provider>;
  }

function Provider(props: ProviderProps<Exts>) {
  const nodes = useMemo(() => {
    const allNodes = props.extensions.flatMap((ext: Extension) => ext.getNodes?.() || []);
    console.log('🔧 Registering nodes with Lexical:', allNodes.map(node => node?.getType?.() || 'unknown'));
    return allNodes;
  }, [props.extensions]);

  const initialConfig = useMemo(
    () => ({
      namespace: 'modern-editor',
      theme: props.config?.theme || {},
      onError: (error: Error) => {
        console.error('❌ Lexical error:', error);
      },
      nodes,
    }),
    [props.config?.theme, nodes]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ProviderInner {...props} />
    </LexicalComposer>
  );
}  return { Provider, useEditor };
}

// Base system for untyped use
export const baseEditorSystem = createEditorSystem<readonly Extension[]>();
export const BaseProvider = baseEditorSystem.Provider;
export const useBaseEditor = baseEditorSystem.useEditor;
