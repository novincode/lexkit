import React from 'react';
import { Extension, ExtensionCategory } from '../extensions';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface DefaultTemplateProps {
  className?: string;
  useEditor?: () => any;
}

export function DefaultTemplate({ className, useEditor: useEditorProp }: DefaultTemplateProps) {
  const useEditorToUse = useEditorProp || (() => ({} as any));
  const { commands, t, hasExtension } = useEditorToUse();

  const toggleBold = () => commands.formatText?.('bold');
  const toggleItalic = () => commands.formatText?.('italic');
  const toggleUnorderedList = () => (commands as any).toggleUnorderedList?.();
  const toggleOrderedList = () => (commands as any).toggleOrderedList?.();
  const undo = () => commands.undo?.();

  return (
    <div className={className}>
      <div className="toolbar flex gap-2 mb-2">
        {hasExtension?.('bold') && (
          <button onClick={toggleBold} className="px-2 py-1 border rounded">
            {t?.('bold.label') || 'Bold'}
          </button>
        )}
        {hasExtension?.('italic') && (
          <button onClick={toggleItalic} className="px-2 py-1 border rounded">
            {t?.('italic.label') || 'Italic'}
          </button>
        )}
        {hasExtension?.('list') && (
          <>
            <button onClick={toggleUnorderedList} className="px-2 py-1 border rounded">
              Bulleted List
            </button>
            <button onClick={toggleOrderedList} className="px-2 py-1 border rounded">
              Numbered List
            </button>
          </>
        )}
        <button onClick={undo} className="px-2 py-1 border rounded">
          Undo
        </button>
      </div>
      <div className="editor-content">
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-32 p-2 border rounded" />}
          placeholder={<div className="text-gray-500">Start typing...</div>}
          ErrorBoundary={ErrorBoundary}
        />
      </div>
      <HistoryPlugin />
    </div>
  );
}
