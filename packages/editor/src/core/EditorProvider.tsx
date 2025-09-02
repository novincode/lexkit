import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalEditor, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND, PASTE_COMMAND } from 'lexical';
import { useTranslation } from 'react-i18next';
import { EditorConfig, EditorContextType, Extension, ComponentRegistry } from './types';
import { useEditorLogic } from './useEditor';
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

export function EditorProvider({ children, config = {}, extensions = [] }: EditorProviderProps) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
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

  const contextValue = useEditorLogic(editor, config, extensions, lazyExports);

  return (
    <LexicalComposer initialConfig={initialConfig}>
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
    </LexicalComposer>
  );
}
