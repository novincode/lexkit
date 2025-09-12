import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, FORMAT_TEXT_COMMAND, PASTE_COMMAND, TextFormatType, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW } from 'lexical';
import { EditorConfig, EditorContextType, Extension, ExtractCommands, ExtractPlugins, ExtractStateQueries, BaseCommands } from '@lexkit/editor/extensions/types';
import { defaultLexKitTheme } from './theme';

interface ProviderProps<Exts extends readonly Extension[]> {
  children: ReactNode;
  config?: EditorConfig;
  extensions: Exts;
}

/**
 * Creates a typed editor system based on the provided extensions array.
 * This factory function generates a Provider component and useEditor hook
 * that are strongly typed based on the extensions passed to it.
 *
 * @template Exts - Array of extensions that define the editor's capabilities
 * @returns Object containing Provider component and useEditor hook
 *
 * @example
 * ```tsx
 * const extensions = [boldExtension, italicExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 * ```
 */
export function createEditorSystem<Exts extends readonly Extension[]>() {
  const EditorContext = createContext<EditorContextType<Exts> | null>(null);

  /**
   * Hook to access the editor context. Must be used within a Provider.
   *
   * @returns Editor context with commands, state, and utilities
   * @throws Error if used outside of Provider
   */
  function useEditor() {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error('useEditor must be used within Provider');
    return ctx;
  }

  /**
   * Internal provider component that sets up the editor context.
   * Handles extension registration, command aggregation, and state management.
   */
  function ProviderInner({ children, config = {}, extensions }: ProviderProps<Exts>) {
    const [editor] = useLexicalComposerContext();

    // Lazy commands from extensions + base
    const baseCommands: BaseCommands = {
      formatText: (format: TextFormatType, value?: boolean | string) => editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format),
    };
    const extensionCommands = useMemo(() => extensions.reduce((acc, ext) => ({ ...acc, ...ext.getCommands(editor!) }), {}), [extensions, editor]);
    const commands = { ...baseCommands, ...extensionCommands } as BaseCommands & ExtractCommands<Exts>;

    // Plugins: Collect and separate by position
    const plugins = useMemo(() => extensions.flatMap(ext => ext.getPlugins?.() || []), [extensions]);
    const pluginsBefore = useMemo(() =>
      extensions.filter(ext => (ext.config?.position || 'before') === 'before').flatMap(ext => ext.getPlugins?.() || []),
      [extensions]
    );
    const pluginsAfter = useMemo(() =>
      extensions.filter(ext => (ext.config?.position || 'before') === 'after').flatMap(ext => ext.getPlugins?.() || []),
      [extensions]
    );

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

    // Batched active states
    const [activeStates, setActiveStates] = useState<ExtractStateQueries<Exts>>(() => {
      const obj: Record<string, boolean> = {};
      Object.keys(stateQueries).forEach(key => obj[key] = false);
      return obj as ExtractStateQueries<Exts>;
    });

    // Reactive state management
    useEffect(() => {
      if (!editor) return;

      const updateStates = async () => {
        const promises = Object.entries(stateQueries).map(([key, queryFn]) =>
          queryFn().then((value) => [key, value] as [string, boolean])
        );

        const results = await Promise.all(promises);
        const newStates = Object.fromEntries(results);
        setActiveStates(newStates as ExtractStateQueries<Exts>);
      };

      // Initial update
      updateStates();

      // Listen to editor updates for standard state queries
      const unregisterEditor = editor.registerUpdateListener(() => {
        updateStates();
      });

      // Listen to extension state changes for reactive extensions
      const unregisterExtensions = extensions.map(ext => {
        if ('onStateChange' in ext && typeof ext.onStateChange === 'function') {
          return (ext as any).onStateChange(updateStates);
        }
        return () => {};
      }).filter(Boolean);

      return () => {
        unregisterEditor();
        unregisterExtensions.forEach(unreg => unreg());
      };
    }, [editor, stateQueries, extensions]);

    /**
     * Context value containing all editor functionality and state.
     * This is the main interface that components use via the useEditor hook.
     */
    const contextValue: EditorContextType<Exts> = {
      editor,
      config,
      extensions,
      commands,
      activeStates: activeStates as ExtractStateQueries<Exts>,
      stateQueries, // Add stateQueries to context
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

    return <EditorContext.Provider value={contextValue}>{pluginsBefore}{children}{pluginsAfter}</EditorContext.Provider>;
  }

  /**
   * Main Provider component that wraps the editor in LexicalComposer.
   * This component should be used at the root of your editor component tree.
   *
   * @param props - Provider props including children, config, and extensions
   * @returns React component that provides editor context
   */
  function Provider(props: ProviderProps<Exts>) {
    const nodes = useMemo(() => {
      const allNodes = props.extensions.flatMap((ext: Extension) => ext.getNodes?.() || []);
      return allNodes;
    }, [props.extensions]);

    const initialConfig = useMemo(
      () => ({
        namespace: 'modern-editor',
        theme: props.config?.theme || defaultLexKitTheme,
        onError: (error: Error) => {
          console.error('Lexical error:', error);
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