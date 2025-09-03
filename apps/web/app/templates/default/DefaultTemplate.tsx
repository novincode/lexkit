'use client'
import React, { useState, useEffect } from 'react';
import { createEditorSystem, boldExtension, italicExtension, listExtension, historyExtension, imageExtension } from '@repo/editor';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { defaultTheme } from './theme';
import './styles.css';
import { Bold, Italic, List, ListOrdered, Undo, Redo, Sun, Moon } from 'lucide-react';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface DefaultTemplateProps {
  className?: string;
}

export function DefaultTemplate({ className }: DefaultTemplateProps) {
  const extensions = [boldExtension, italicExtension, listExtension, historyExtension, imageExtension] as const;
  const { Provider, useEditor } = createEditorSystem<typeof extensions>();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  function Toolbar() {
    const { commands, hasExtension, activeStates } = useEditor();

    
    return (
      <div className={defaultTheme.toolbar}>
        {hasExtension('bold') && (
          <button onClick={() => commands.toggleBold()} className={activeStates.bold ? 'active' : ''} title="Bold">
            <Bold size={20} />
          </button>
        )}
        {hasExtension('italic') && (
          <button onClick={() => commands.toggleItalic()} className={activeStates.italic ? 'active' : ''} title="Italic">
            <Italic size={20} />
          </button>
        )}
        {hasExtension('list') && (
          <>
            <button onClick={() => commands.toggleUnorderedList()} className={activeStates.unorderedList ? 'active' : ''} title="Bulleted List">
              <List size={20} />
            </button>
            <button onClick={() => commands.toggleOrderedList()} className={activeStates.orderedList ? 'active' : ''} title="Numbered List">
              <ListOrdered size={20} />
            </button>
          </>
        )}
        {hasExtension('history') && (
          <>
            <button onClick={() => commands.undo()} className={activeStates.canUndo ? '' : 'disabled'} title="Undo">
              <Undo size={20} />
            </button>
            <button onClick={() => commands.redo()} disabled={!activeStates.canRedo} className={activeStates.canRedo ? '' : 'disabled'} title="Redo">
              <Redo size={20} />
            </button>
          </>
        )}
        <button onClick={() => setIsDark(!isDark)} title={isDark ? 'Light Mode' : 'Dark Mode'}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`lexkit-editor-wrapper ${className || ''}`} style={{ width: '100%',  display: 'flex', flexDirection: 'column' }}>
      <Provider extensions={extensions} config={{ theme: defaultTheme }}>
        <div style={{ flex: 1, display: 'flex',maxHeight:'100vh', flexDirection: 'column', position: 'relative' }}>
          <Toolbar />
          <div className={defaultTheme.editor}>
            <RichTextPlugin
              contentEditable={<ContentEditable className={defaultTheme.contentEditable} />}
              placeholder={<div className="lexkit-placeholder">Start typing...</div>}
              ErrorBoundary={ErrorBoundary}
            />
          </div>
        </div>
      </Provider>
    </div>
  );
}
