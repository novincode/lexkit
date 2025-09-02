import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalEditor, FORMAT_TEXT_COMMAND } from 'lexical';
import { useTranslation } from 'react-i18next';
import { EditorConfig, EditorContextType, Extension, ComponentRegistry } from './types';
import { componentRegistry } from '../components/registry';

const EditorContext = createContext<EditorContextType | null>(null);

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return {
    ...ctx,
    commands: {
      bold: (enable: boolean) => {
        ctx.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      },
      isActive: (format: string) => {
        // Implement
        return false;
      },
    },
    extensions: {
      add: (exts: any[]) => {
        // Implement
      },
    },
  };
}

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

interface EditorProviderProps {
  children: ReactNode;
  config?: EditorConfig;
  extensions?: any[];
}

export function EditorProvider({ children, config = {}, extensions = [] }: EditorProviderProps) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  const { t } = useTranslation();

  const initialConfig = {
    namespace: 'modern-editor',
    theme: config.theme || {},
    onError: console.error,
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

  const contextValue: EditorContextType = {
    editor,
    config,
    components: componentRegistry,
    extensions,
    t,
    lexical: editor,
  };

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
