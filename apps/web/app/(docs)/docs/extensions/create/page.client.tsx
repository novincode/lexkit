'use client'

import React from 'react';
import BasicEditorWithCustomExtension from '../examples/BasicEditorWithCustomExtension';

export default function ExtensionsPageClient() {
  return (
    <div className="extensions-page">
      <h1>Extensions Documentation</h1>
      <p>
        LexKit extensions allow you to add custom functionality to your rich text editor.
        Extensions can provide commands, state queries, toolbar items, and more.
      </p>

      <h2>Example: Basic Editor with Custom Extension</h2>
      <p>
        Below is a basic editor that uses the TestExtension. This extension provides:
      </p>
      <ul>
        <li><strong>Insert Timestamp:</strong> Inserts the current timestamp at the cursor position.</li>
        <li><strong>Clear Content:</strong> Clears all content from the editor.</li>
        <li><strong>Get Word Count:</strong> Displays the word count (placeholder implementation).</li>
      </ul>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
        <BasicEditorWithCustomExtension />
      </div>

      <h3>How to Create Your Own Extension</h3>
      <p>
        To create a custom extension, use the <code>createExtension</code> function from <code>@lexkit/editor</code>.
        Define your commands, state queries, and initialization logic.
      </p>

      <pre style={{ background: '#f9fafb', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
{`import { createExtension } from '@lexkit/editor';

const MyExtension = createExtension<'my-extension', {}, MyCommands, MyStateQueries, React.ReactNode[]>({
  name: 'my-extension',
  commands: (editor) => ({
    myCommand: () => {
      // Implement your command
    }
  }),
  stateQueries: (editor) => ({
    myQuery: async () => {
      // Implement your state query
    }
  }),
  initialize: (editor) => {
    // Initialization logic
    return () => {
      // Cleanup logic
    };
  }
});`}
      </pre>

      <p>
        Then, add your extension to the extensions array and use it in your editor system.
      </p>
    </div>
  );
}
