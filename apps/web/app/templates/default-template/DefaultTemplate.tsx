import React from 'react';
import { createEditorSystem, boldExtension, italicExtension, listExtension, historyExtension, imageExtension } from '@repo/editor';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { defaultTheme } from './theme';
import './styles.css';

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
    const toggleUnorderedList = () => commands.toggleOrderedList();
    const toggleOrderedList = () => commands.toggleOrderedList();
    const undo = () => commands.undo();

    return (
      <div className={defaultTheme.toolbar}>
        {hasExtension('bold') && (
          <button onClick={toggleBold}>
            Bold
          </button>
        )}
        {hasExtension('italic') && (
          <button onClick={toggleItalic}>
            Italic
          </button>
        )}
        {hasExtension('list') && (
          <>
            <button onClick={toggleUnorderedList}>
              Bulleted List
            </button>
            <button onClick={toggleOrderedList}>
              Numbered List
            </button>
          </>
        )}
        <button onClick={undo}>
          Undo
        </button>
      </div>
    );
  }

  return (
    <Provider extensions={extensions} config={{ theme: defaultTheme }}>
      <div className={className}>
        <Toolbar />
        <div className={defaultTheme.editor}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={defaultTheme.contentEditable} />}
            placeholder={<div className="text-gray-500">Start typing...</div>}
            ErrorBoundary={ErrorBoundary}
          />
        </div>
      </div>
    </Provider>
  );
}
