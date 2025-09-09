'use client'

import React, { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalEditor } from 'lexical';
import { createEditorSystem } from '@lexkit/editor/core/createEditorSystem';
import { RichText } from '@lexkit/editor';
import { TestBaseExtension } from './TestBaseExtension';
import '../../../examples/basic-editor.css'; // Reuse the basic editor CSS

// Define the extensions array
const extensions = [TestBaseExtension] as const;

// Create the editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Toolbar component
function Toolbar() {
  const { commands, activeStates } = useEditor();

  return (
    <div className="basic-toolbar">
      <button onClick={() => commands.insertTimestamp()}>
        Insert Timestamp
      </button>
      <button onClick={() => commands.clearContent()}>
        Clear Content
      </button>
      <button onClick={() => commands.getWordCount()}>
        Hello World
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
      <RichText
        placeholder="Start typing..."
        classNames={{
          contentEditable: "basic-content",
          placeholder: "basic-placeholder"
        }}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
    </div>
  );
}

// Main component
export default function BasicEditorWithBaseExtension() {
  const initialConfig = {
    namespace: 'basic-editor-base',
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
