import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, PASTE_COMMAND, TextFormatType, $getSelection, $isRangeSelection } from 'lexical';
import { useTranslation } from 'react-i18next';
import { EditorConfig, EditorContextType, Extension, ExtractCommands, ExtractPlugins, BaseCommands } from '../extensions/types';
import { defaultTheme, mergeTheme } from '@repo/editor/themes';

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
    const { t } = useTranslation();

    // Lazy commands from extensions + base
    const baseCommands = {
      formatText: (format: TextFormatType, value?: boolean | string) => editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format),
      undo: () => editor?.dispatchCommand(UNDO_COMMAND, undefined),
      redo: () => editor?.dispatchCommand(REDO_COMMAND, undefined),
      clearHistory: () => editor?.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
    };
    const extensionCommands = extensions.flatMap(ext => ext.getCommands ? [ext.getCommands(editor!)] : []).reduce((acc, cmds) => ({ ...acc, ...cmds }), {});
    const commands = { ...baseCommands, ...extensionCommands } as BaseCommands & ExtractCommands<Exts>;

    // Plugins: Collect inferred
    const plugins = extensions.flatMap(ext => ext.getPlugins?.() || []) as ExtractPlugins<Exts>[];

    // Lazy exports
    const [lazyExports, setLazyExports] = useState({
      toHTML: async () => '',
      toMarkdown: async () => '',
      fromHTML: async (html: string) => {},
      fromMarkdown: async (md: string) => {},
    });

    useEffect(() => {
      Promise.all([
        import('@lexical/html'),
        import('@lexical/markdown'),
      ]).then(([{ $generateHtmlFromNodes }, { $convertToMarkdownString, $convertFromMarkdownString }]) => {
        setLazyExports({
          toHTML: async () => editor ? $generateHtmlFromNodes(editor) : '',
          toMarkdown: async () => editor ? $convertToMarkdownString() : '',
          fromHTML: async (html: string) => {
            // Implement if needed
          },
          fromMarkdown: async (md: string) => {
            editor?.update(() => $convertFromMarkdownString(md));
          },
        });
      });
    }, [editor]);

    useEffect(() => {
      if (editor) {
        const unregisters = extensions.map(ext => ext.register(editor));
        return () => unregisters.forEach(un => un());
      }
    }, [editor, extensions]);

    const contextValue: EditorContextType<Exts> = {
      editor,
      config,
      extensions,
      commands,
      listeners: {
        registerUpdate: (listener: (state: any) => void) => editor?.registerUpdateListener(listener) || (() => {}),
        registerPaste: (listener: (event: ClipboardEvent) => boolean) => editor?.registerCommand(PASTE_COMMAND, listener, 4) || (() => {}),
      },
      export: {
        toHTML: lazyExports.toHTML,
        toMarkdown: lazyExports.toMarkdown,
        toJSON: () => editor?.getEditorState().toJSON(),
      },
      import: {
        fromHTML: lazyExports.fromHTML,
        fromMarkdown: lazyExports.fromMarkdown,
        fromJSON: (json: any) => editor?.setEditorState(editor.parseEditorState(json)),
      },
      history: {
        undo: () => editor?.dispatchCommand(UNDO_COMMAND, undefined),
        redo: () => editor?.dispatchCommand(REDO_COMMAND, undefined),
        clear: () => editor?.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
      },
      lexical: editor,
      extensionsAPI: {
        add: (ext: Extension) => {}, // TODO: Implement dynamic add
        remove: (name: string) => {},
        reorder: (names: string[]) => {},
      },
      plugins,
      hasExtension: (name) => extensions.some(ext => ext.name === name),
    };

    return <EditorContext.Provider value={contextValue}>{children}{plugins}</EditorContext.Provider>;
  }

  function Provider(props: ProviderProps<Exts>) {
    const nodes = props.extensions.flatMap((ext: Extension) => ext.getNodes?.() || []);

    const initialConfig = {
      namespace: 'modern-editor',
      theme: props.config?.theme || {},
      onError: console.error,
      nodes,
    };

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <ProviderInner {...props} />
      </LexicalComposer>
    );
  }

  return { Provider, useEditor };
}

// Base system for untyped use
export const baseEditorSystem = createEditorSystem<Extension[]>();
export const BaseProvider = baseEditorSystem.Provider;
export const useBaseEditor = baseEditorSystem.useEditor;
