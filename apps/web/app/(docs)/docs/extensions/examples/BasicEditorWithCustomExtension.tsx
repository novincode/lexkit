'use client'

import React, { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalEditor } from 'lexical';
import { createEditorSystem } from '@lexkit/editor/core/createEditorSystem';
import { TestExtension } from './TestExtension';
import '../../examples/basic-editor.css'; // Reuse the basic editor CSS

// Define the extensions array
const extensions = [TestExtension] as const;

// Create the editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Toolbar component
function Toolbar() {
  const { commands, activeStates } = useEditor();

  return (
    <div className="basic-toolbar">
      <button
        onClick={() => commands.insertTimestamp()}
        disabled={!activeStates.hasSelection}
      >
        Insert Timestamp
      </button>
      <button onClick={() => commands.clearContent()}>
        Clear Content
      </button>
      <button onClick={() => alert(`Word count: ${commands.getWordCount()}`)}>
        Get Word Count
      </button>
    </div>
  );
}

// Editor content component
function EditorContent() {
  const [editorState, setEditorState] = useState<string>('');

  const onChange = (editorState: any) => {
    setEditorState(JSON.stringify(editorState.toJSON()));
  };

  return (
    <div className="basic-editor">
      <Toolbar />
      <RichTextPlugin
        contentEditable={<ContentEditable className="basic-content" />}
        placeholder={<div className="basic-placeholder">Start typing...</div>}
        ErrorBoundary={() => <div>Error occurred</div>}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
    </div>
  );
}

// Main component
export default function BasicEditorWithCustomExtension() {
  const initialConfig = {
    namespace: 'basic-editor',
    theme: {},
    onError: (error: Error) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Provider extensions={extensions}>
        <EditorContent />
      </Provider>
    </LexicalComposer>
  );
}
