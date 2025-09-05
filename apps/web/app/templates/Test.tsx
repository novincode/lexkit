import React, { useState } from 'react';
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
} from '@lexkit/editor';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

// 1. Define your extensions (as const for type safety)
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
] as const; // 👈 Required for TypeScript to infer literal types

// 2. Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// 3. Configure extensions (optional)
imageExtension.configure({
  uploadHandler: async (file: File) => {
    // Your upload logic here
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await response.json();
    return url;
  },
  defaultAlignment: 'center',
  resizable: true,
  pasteListener: { insert: true, replace: true }, // Auto-insert pasted images
  debug: false
});

// 4. Create your toolbar component
function Toolbar() {
  const { commands, activeStates, hasExtension } = useEditor();

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '8px', borderBottom: '1px solid #ccc' }}>
      {hasExtension('bold') && (
        <button
          onClick={() => commands.toggleBold()}
          style={{
            fontWeight: activeStates.bold ? 'bold' : 'normal',
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: activeStates.bold ? '#e0e0e0' : 'white'
          }}
        >
          Bold
        </button>
      )}

      {hasExtension('italic') && (
        <button
          onClick={() => commands.toggleItalic()}
          style={{
            fontStyle: activeStates.italic ? 'italic' : 'normal',
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: activeStates.italic ? '#e0e0e0' : 'white'
          }}
        >
          Italic
        </button>
      )}

      {hasExtension('list') && (
        <>
          <button onClick={() => commands.toggleUnorderedList()}>
            • List
          </button>
          <button onClick={() => commands.toggleOrderedList()}>
            1. List
          </button>
        </>
      )}

      {hasExtension('image') && (
        <button onClick={() => {
          const src = prompt('Image URL:');
          if (src) commands.insertImage({ src, alt: 'Image' });
        }}>
          📷 Image
        </button>
      )}

      {hasExtension('history') && (
        <>
          <button
            onClick={() => commands.undo()}
            disabled={!activeStates.canUndo}
          >
            ↶ Undo
          </button>
          <button
            onClick={() => commands.redo()}
            disabled={!activeStates.canRedo}
          >
            ↷ Redo
          </button>
        </>
      )}
    </div>
  );
}

// 5. Create your editor component
function Editor() {
  const { commands, hasExtension } = useEditor();
  const [mode, setMode] = useState<'visual' | 'html' | 'markdown'>('visual');
  const [content, setContent] = useState('');

  const handleModeChange = (newMode: typeof mode) => {
    if (newMode === 'html' && hasExtension('html')) {
      setContent(commands.exportToHTML());
    } else if (newMode === 'markdown' && hasExtension('markdown')) {
      setContent(commands.exportToMarkdown());
    }
    setMode(newMode);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (mode === 'html' && hasExtension('html')) {
      commands.importFromHTML(value);
    } else if (mode === 'markdown' && hasExtension('markdown')) {
      commands.importFromMarkdown(value);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      {/* Mode Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => handleModeChange('visual')}
          style={{
            padding: '8px 16px',
            background: mode === 'visual' ? '#f0f0f0' : 'white',
            border: 'none',
            borderRight: '1px solid #ccc'
          }}
        >
          Visual
        </button>
        <button
          onClick={() => handleModeChange('html')}
          style={{
            padding: '8px 16px',
            background: mode === 'html' ? '#f0f0f0' : 'white',
            border: 'none',
            borderRight: '1px solid #ccc'
          }}
        >
          HTML
        </button>
        <button
          onClick={() => handleModeChange('markdown')}
          style={{
            padding: '8px 16px',
            background: mode === 'markdown' ? '#f0f0f0' : 'white',
            border: 'none'
          }}
        >
          Markdown
        </button>
      </div>

      {/* Toolbar (only in visual mode) */}
      {mode === 'visual' && <Toolbar />}

      {/* Editor Content */}
      <div style={{ minHeight: '200px' }}>
        {mode === 'visual' ? (
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  padding: '16px',
                  outline: 'none',
                  minHeight: '200px'
                }}
              />
            }
            placeholder={
              <div style={{ color: '#999', padding: '16px' }}>
                Start writing...
              </div>
            }
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '16px',
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
            placeholder={`Enter ${mode.toUpperCase()} content...`}
          />
        )}
      </div>

      <HistoryPlugin />
    </div>
  );
}

// 6. Use it in your app
export default function App() {
  return (
    <Provider extensions={extensions}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>My LexKit Editor</h1>
        <Editor />
      </div>
    </Provider>
  );
}