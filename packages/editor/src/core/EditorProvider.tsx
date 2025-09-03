import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, PASTE_COMMAND, TextFormatType, $getSelection, $isRangeSelection } from 'lexical';
import { useTranslation } from 'react-i18next';
import { EditorConfig, EditorContextType, Extension } from './types';
import { REMOVE_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, ListNode } from '@lexical/list';

export const EditorContext = createContext<EditorContextType | null>(null);

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

interface EditorProviderProps {
  children: ReactNode;
  config?: EditorConfig;
  extensions?: Extension[];
  plugins?: ReactNode[];
}

function EditorProviderInner({ children, config = {}, extensions = [], plugins = [] }: EditorProviderProps) {
  const [editor] = useLexicalComposerContext();
  const [lazyExports, setLazyExports] = useState({
    toHTML: async () => '',
    toMarkdown: async () => '',
    fromHTML: async (html: string) => {},
    fromMarkdown: async (md: string) => {},
  });
  const { t } = useTranslation();

  const nodes = extensions.flatMap(ext => ext.getNodes?.() || []);

  const initialConfig = {
    namespace: 'modern-editor',
    theme: config.theme,
    onError: console.error,
    nodes: nodes,
  };

  useEffect(() => {
    // Lazy load HTML and Markdown modules
    Promise.all([
      import('@lexical/html'),
      import('@lexical/markdown'),
    ]).then(([{ $generateHtmlFromNodes }, { $convertToMarkdownString, $convertFromMarkdownString }]) => {
      setLazyExports({
        toHTML: async () => editor ? $generateHtmlFromNodes(editor) : '',
        toMarkdown: async () => editor ? $convertToMarkdownString() : '',
        fromHTML: async (html: string) => {
          // Implement
        },
        fromMarkdown: async (md: string) => {
          editor?.update(() => $convertFromMarkdownString(md));
        },
      });
    });
  }, [editor]);

  useEffect(() => {
    if (editor) {
      const unregisters: (() => void)[] = [];
      extensions.forEach((ext) => {
        if (ext.register) {
          unregisters.push(ext.register(editor));
        }
      });
      return () => {
        unregisters.forEach((unregister) => unregister());
      };
    }
  }, [editor, extensions]);

  const contextValue: EditorContextType = {
    editor,
    config,
    extensions,
    t: t as any,
    commands: {
      formatText: (format: TextFormatType, value?: boolean | string) => editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format),
      undo: () => editor?.dispatchCommand(UNDO_COMMAND, undefined),
      redo: () => editor?.dispatchCommand(REDO_COMMAND, undefined),
      clearHistory: () => editor?.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
      insertUnorderedList: () => editor?.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      insertOrderedList: () => editor?.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      toggleUnorderedList: () => {
        editor?.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            const hasList = nodes.some(node => node.getType() === 'list');
            if (hasList) {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            }
          }
        });
      },
      toggleOrderedList: () => {
        editor?.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            const hasList = nodes.some(node => node.getType() === 'list');
            if (hasList) {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }
          }
        });
      },
      isActive: (type: string) => {
        if (!editor) return false;
        return editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            return selection.hasFormat(type as TextFormatType);
          }
          return false;
        });
      },
    },
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
      add: (ext: Extension) => {}, // TODO: Implement state management
      remove: (name: string) => {},
      reorder: (names: string[]) => {},
    },
    plugins,
    hasPlugin: (name: string) => extensions.some(ext => ext.name === name),
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

export function EditorProvider(props: EditorProviderProps) {
  const nodes = props.extensions?.flatMap(ext => ext.getNodes?.() || []) || [];
  const plugins = props.extensions?.flatMap(ext => ext.getPlugins?.() || []) || [];

  const initialConfig = {
    namespace: 'modern-editor',
    theme: props.config?.theme || {},
    onError: console.error,
    nodes: nodes,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorProviderInner {...props} plugins={plugins} />
    </LexicalComposer>
  );
}
