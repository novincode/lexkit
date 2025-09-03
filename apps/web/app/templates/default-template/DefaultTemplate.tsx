import React from 'react';
import { createEditorSystem, boldExtension, italicExtension, listExtension, historyExtension, imageExtension } from '@repo/editor';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface DefaultTemplateProps {
  className?: string;
}

export function DefaultTemplate({ className }: DefaultTemplateProps) {
  const extensions = [boldExtension, italicExtension, listExtension, historyExtension, imageExtension] as const;
  const { Provider, useEditor } = createEditorSystem<typeof extensions>();

  function Toolbar() {
    const { commands, hasExtension } = useEditor();

    const toggleBold = () => commands.formatText('bold');
    const toggleItalic = () => commands.formatText('italic');
    const toggleUnorderedList = () => commands.toggleUnorderedList?.();
    const toggleOrderedList = () => commands.toggleOrderedList?.();
    const undo = () => commands.undo();

    return (
      <div className="toolbar flex gap-2 mb-2">
        {hasExtension('bold') && (
          <button onClick={toggleBold} className="px-2 py-1 border rounded">
            Bold
          </button>
        )}
        {hasExtension('italic') && (
          <button onClick={toggleItalic} className="px-2 py-1 border rounded">
            Italic
          </button>
        )}
        {hasExtension('list') && (
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
    );
  }

  return (
    <Provider extensions={extensions} config={{}}>
      <div className={className}>
        <Toolbar />
        <div className="editor-content">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-32 p-2 border rounded" />}
            placeholder={<div className="text-gray-500">Start typing...</div>}
            ErrorBoundary={ErrorBoundary}
          />
        </div>
      </div>
    </Provider>
  );
}
