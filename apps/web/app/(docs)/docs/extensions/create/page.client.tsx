'use client'

import React from 'react';
import BasicEditorWithCustomExtension from '../examples/BasicEditorWithCustomExtension';
import { DynamicCodeExample } from '@/app/(docs)/components/dynamic-code-example';
import { SimpleCodeBlock } from '@/app/(docs)/components/simple-code-block';
import { getRawCode, getHighlightedCode } from '@/lib/generated/code-registry';

export default function ExtensionsPageClient() {
  return (
    <div className="extensions-page">
      <h1>Creating Custom Extensions</h1>
      <p>
        LexKit extensions allow you to add custom functionality to your rich text editor.
        Extensions can provide commands, state queries, toolbar items, and more.
      </p>

      <h2>Live Example: Basic Editor with TestExtension</h2>
      <p>
        Below is a live editor that uses the TestExtension. This extension provides:
      </p>
      <ul>
        <li><strong>Insert Timestamp:</strong> Inserts the current timestamp at the cursor position.</li>
        <li><strong>Clear Content:</strong> Clears all content from the editor.</li>
        <li><strong>Get Word Count:</strong> Displays the word count (placeholder implementation).</li>
      </ul>

      <DynamicCodeExample
        title="Interactive Extension Example"
        description="Try the buttons below to test the TestExtension functionality"
        codes={['docs/extensions/examples/BasicEditorWithCustomExtension.tsx', 'docs/extensions/examples/TestExtension.tsx']}
        preview={<BasicEditorWithCustomExtension />}
      />

      <h2>Extension Definition</h2>
      <p>
        Here's how the TestExtension is defined using the <code>createExtension</code> function:
      </p>

      <SimpleCodeBlock
        title="TestExtension Implementation"
        html={getHighlightedCode('test-extension-definition') || ''}
        raw={getRawCode('test-extension-definition') || ''}
      />

      <h2>Using Extensions in Your Editor</h2>
      <p>
        To use your extension, add it to the extensions array and create an editor system:
      </p>

      <SimpleCodeBlock
        title="Basic Editor Setup"
        html={getHighlightedCode('basic-editor-with-extension') || ''}
        raw={getRawCode('basic-editor-with-extension') || ''}
      />

      <h3>Key Extension Concepts</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Commands</h4>
          <p>Define functions that can be called to perform actions in the editor. Commands are strongly typed and accessible via the <code>useEditor</code> hook.</p>
        </div>
        <div>
          <h4 className="font-semibold">State Queries</h4>
          <p>Define functions that return the current state of the editor. These are used for determining button states, showing/hiding UI elements, etc.</p>
        </div>
        <div>
          <h4 className="font-semibold">Initialize Function</h4>
          <p>Optional setup function that runs when the extension is loaded. Return a cleanup function for proper teardown.</p>
        </div>
      </div>

      <h3>Next Steps</h3>
      <p>
        You can extend the TestExtension or create your own by:
      </p>
      <ul>
        <li>Adding more commands for different text manipulations</li>
        <li>Implementing proper word count logic</li>
        <li>Adding custom Lexical nodes for rich content</li>
        <li>Creating toolbar buttons and UI components</li>
      </ul>
    </div>
  );
}
