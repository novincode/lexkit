import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, PASTE_COMMAND, TextFormatType, $getSelection, $isRangeSelection } from 'lexical';
import { useTranslation } from 'react-i18next';
import { EditorConfig, EditorContextType, Extension, ComponentRegistry } from './types';
import { componentRegistry } from '../components/registry';

export const EditorContext = createContext<EditorContextType | null>(null);

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

interface EditorProviderProps {
  children: ReactNode;
  config?: EditorConfig;
  extensions?: Extension[];
}

function EditorProviderInner({ children, config = {}, extensions = [] }: EditorProviderProps) {
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
    theme: config.theme || {},
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
    components: componentRegistry,
    extensions,
    t: t as any,
    commands: {
      formatText: (format: TextFormatType, value?: boolean | string) => editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format),
      undo: () => editor?.dispatchCommand(UNDO_COMMAND, undefined),
      redo: () => editor?.dispatchCommand(REDO_COMMAND, undefined),
      clearHistory: () => editor?.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined),
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
  };

  return (
    <EditorContext.Provider value={contextValue}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div>{t('placeholder')}</div>}
          ErrorBoundary={ErrorBoundary}
        />
        <HistoryPlugin />
        {children}
      </div>
    </EditorContext.Provider>
  );
}

export function EditorProvider(props: EditorProviderProps) {
  const nodes = props.extensions?.flatMap(ext => ext.getNodes?.() || []) || [];

  const initialConfig = {
    namespace: 'modern-editor',
    theme: props.config?.theme || {},
    onError: console.error,
    nodes: nodes,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorProviderInner {...props} />
    </LexicalComposer>
  );
}
