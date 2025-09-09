import { codeToHtml } from 'shiki'

// Define code snippets that will be registered and generated at build time
export interface RegisteredCodeSnippet {
  id: string
  code: string
  language: string
  title?: string
  description?: string
  highlightLines?: number[]
}

// Basic installation examples
export const INSTALLATION_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'install-npm',
    code: 'npm install @lexkit/editor',
    language: 'bash',
    title: 'Install with npm',
    description: 'Install LexKit using npm'
  },
  {
    id: 'install-pnpm',
    code: 'pnpm add @lexkit/editor',
    language: 'bash',
    title: 'Install with pnpm',
    description: 'Install LexKit using pnpm'
  },
  {
    id: 'install-yarn',
    code: 'yarn add @lexkit/editor',
    language: 'bash',
    title: 'Install with yarn',
    description: 'Install LexKit using yarn'
  }
]

// Basic usage examples
export const BASIC_USAGE_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'basic-import',
    code: `import { createEditorSystem } from '@lexkit/editor'
import { DefaultTemplate } from '@lexkit/editor/templates'`,
    language: 'typescript',
    title: 'Import LexKit',
    description: 'Import the main components'
  },
  {
    id: 'basic-setup',
    code: `function MyEditor() {
  return (
    <DefaultTemplate
      onReady={(editor) => {
        console.log('Editor is ready!')
      }}
    />
  )
}`,
    language: 'tsx',
    title: 'Basic Setup',
    description: 'Create a basic editor component',
    highlightLines: [3, 4, 5, 6]
  },
  {
    id: 'with-content',
    code: `function MyEditor() {
  const handleReady = (editor) => {
    editor.injectMarkdown('# Welcome to LexKit!\\n\\nStart writing...')
  }

  return (
    <DefaultTemplate onReady={handleReady} />
  )
}`,
    language: 'tsx',
    title: 'Initialize with Content',
    description: 'Load initial content into the editor',
    highlightLines: [3, 4]
  }
]

// Extension examples
export const EXTENSION_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'custom-extension',
    code: `import { createExtension } from '@lexkit/editor'

const MyCustomExtension = createExtension({
  name: 'my-extension',
  initialize: (editor) => {
    // Add custom functionality
    editor.registerCommand('my-command', () => {
      console.log('Custom command executed!')
    })
  }
})`,
    language: 'typescript',
    title: 'Create Custom Extension',
    description: 'Build your own editor extensions',
    highlightLines: [4, 5, 6, 7, 8]
  },
  {
    id: 'extension-setup',
    code: `const editorSystem = createEditorSystem({
  extensions: [
    MyCustomExtension,
    // Add more extensions here
  ]
})

function MyEditor() {
  return (
    <DefaultTemplate
      system={editorSystem}
      onReady={(editor) => {
        console.log('Editor with extensions ready!')
      }}
    />
  )
}`,
    language: 'tsx',
    title: 'Use Extensions',
    description: 'Configure editor with custom extensions',
    highlightLines: [3, 4, 5]
  },
  {
    id: 'test-extension-definition',
    code: `import React from 'react';
import { createExtension } from '@lexkit/editor';
import { ExtensionCategory } from '@lexkit/editor/extensions/types';
import { LexicalEditor, $getSelection, $isRangeSelection, $getRoot } from 'lexical';

// Define the commands interface
type TestCommands = {
  insertTimestamp: () => void;
  clearContent: () => void;
  getWordCount: () => number;
};

// Define the state queries interface
type TestStateQueries = {
  hasSelection: () => Promise<boolean>;
  isEmpty: () => Promise<boolean>;
};

// Create the extension using the new createExtension function
const TestExtension = createExtension<'test-extension', {}, TestCommands, TestStateQueries, React.ReactNode[]>({
  name: 'test-extension',
  category: [ExtensionCategory.Toolbar],

  // Define commands
  commands: (editor) => ({
    insertTimestamp: () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const timestamp = new Date().toLocaleString();
          selection.insertText(timestamp);
        }
      });
    },

    clearContent: () => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
    },

    getWordCount: () => {
      // This would need to be implemented based on editor content
      return 42; // Placeholder
    }
  }),

  // Define state queries
  stateQueries: (editor) => ({
    hasSelection: async () => {
      return new Promise((resolve) => {
        editor.read(() => {
          const selection = $getSelection();
          resolve($isRangeSelection(selection) && !selection.isCollapsed());
        });
      });
    },

    isEmpty: async () => {
      return new Promise((resolve) => {
        editor.read(() => {
          const root = $getRoot();
          resolve(!root.getTextContent().trim());
        });
      });
    }
  }),

  // Initialize function (optional)
  initialize: (editor) => {
    console.log('TestExtension initialized!');

    // Return cleanup function
    return () => {
      console.log('TestExtension cleaned up!');
    };
  }
});

export { TestExtension };`,
    language: 'tsx',
    title: 'TestExtension Definition',
    description: 'Complete TestExtension implementation with commands, state queries, and initialization',
    highlightLines: [18, 24, 46, 62]
  },
  {
    id: 'basic-editor-with-extension',
    code: `'use client'

import React, { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { createEditorSystem } from '@lexkit/editor/core/createEditorSystem';
import { TestExtension } from './TestExtension';

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
      <button onClick={() => alert(\`Word count: \${commands.getWordCount()}\`)}>
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
}`,
    language: 'tsx',
    title: 'Basic Editor with Custom Extension',
    description: 'Complete example of using a custom extension in an editor',
    highlightLines: [13, 16, 19, 24, 29, 32]
  }
]

// Styling examples
export const STYLING_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'tailwind-styling',
    code: `.editor-container {
  @apply border rounded-lg p-4;
}

.editor-content {
  @apply prose prose-sm max-w-none;
}

.editor-toolbar {
  @apply flex gap-2 p-2 border-b bg-muted/50;
}`,
    language: 'css',
    title: 'Tailwind CSS Styling',
    description: 'Style your editor with Tailwind classes'
  },
  {
    id: 'theme-provider',
    code: `import { ThemeProvider } from '@lexkit/editor'

function App() {
  return (
    <ThemeProvider theme="dark">
      <MyEditor />
    </ThemeProvider>
  )
}`,
    language: 'tsx',
    title: 'Theme Provider',
    description: 'Apply themes to your editor'
  }
]

// All registered snippets
export const ALL_REGISTERED_SNIPPETS: RegisteredCodeSnippet[] = [
  ...INSTALLATION_EXAMPLES,
  ...BASIC_USAGE_EXAMPLES,
  ...EXTENSION_EXAMPLES,
  ...STYLING_EXAMPLES
]

// Helper function to get a snippet by ID
export function getRegisteredSnippet(id: string): RegisteredCodeSnippet | undefined {
  return ALL_REGISTERED_SNIPPETS.find(snippet => snippet.id === id)
}

// Helper function to get snippets by category
export function getSnippetsByCategory(category: 'installation' | 'basic' | 'extensions' | 'styling'): RegisteredCodeSnippet[] {
  switch (category) {
    case 'installation':
      return INSTALLATION_EXAMPLES
    case 'basic':
      return BASIC_USAGE_EXAMPLES
    case 'extensions':
      return EXTENSION_EXAMPLES
    case 'styling':
      return STYLING_EXAMPLES
    default:
      return []
  }
}
