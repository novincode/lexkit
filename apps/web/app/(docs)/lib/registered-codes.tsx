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
    id: 'basic-editor',
    code: `function MyEditor() {
  return (
    <DefaultTemplate
      onReady={(editor) => {
        console.log('Editor ready!')
        // Access editor methods here
        editor.injectMarkdown('# Hello World')
      }}
    />
  )
}`,
    language: 'tsx',
    title: 'Basic Editor Component',
    description: 'Create a basic editor with ready callback',
    highlightLines: [3, 4, 5, 6, 7]
  },
  {
    id: 'editor-with-content',
    code: `function MyEditor() {
  const [content, setContent] = useState('')

  const handleReady = (editor) => {
    // Load initial content
    editor.injectMarkdown('# Welcome!\\n\\nStart writing...')

    // Save content on change
    editor.onChange = (newContent) => {
      setContent(newContent)
    }
  }

  return <DefaultTemplate onReady={handleReady} />
}`,
    language: 'tsx',
    title: 'Editor with Content Management',
    description: 'Load and save editor content',
    highlightLines: [5, 6, 9, 10, 11]
  }
]

// Extension examples
export const EXTENSION_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'create-extension-basic',
    code: `import { createExtension } from '@lexkit/editor'

const MyExtension = createExtension({
  name: 'my-extension',
  commands: (editor) => ({
    // Define your commands here
    myCommand: () => console.log('Hello!')
  })
})`,
    language: 'typescript',
    title: 'Create Basic Extension',
    description: 'Minimal extension with a single command',
    highlightLines: [4, 5, 6, 7]
  },
  {
    id: 'extension-commands',
    code: `commands: (editor) => ({
  insertText: (text: string) => {
    editor.update(() => {
      // Insert text at cursor
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selection.insertText(text)
      }
    })
  },

  clearEditor: () => {
    editor.update(() => {
      $getRoot().clear()
    })
  }
})`,
    language: 'typescript',
    title: 'Extension Commands',
    description: 'Define commands that manipulate the editor',
    highlightLines: [2, 3, 4, 5, 6, 10, 11, 12]
  },
  {
    id: 'extension-state-queries',
    code: `stateQueries: (editor) => ({
  hasSelection: async () => {
    return new Promise(resolve => {
      editor.read(() => {
        const selection = $getSelection()
        resolve($isRangeSelection(selection))
      })
    })
  },

  isEmpty: async () => {
    return new Promise(resolve => {
      editor.read(() => {
        resolve(!$getRoot().getTextContent().trim())
      })
    })
  }
})`,
    language: 'typescript',
    title: 'State Queries',
    description: 'Query editor state for UI decisions',
    highlightLines: [2, 3, 4, 5, 6, 10, 11, 12, 13]
  },
  {
    id: 'extension-setup',
    code: `// 1. Define your extensions
const extensions = [MyExtension] as const

// 2. Create editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// 3. Use in component
function MyEditor() {
  return (
    <Provider extensions={extensions}>
      <EditorContent />
    </Provider>
  )
}`,
    language: 'typescript',
    title: 'Setup Extension System',
    description: 'Three steps to integrate extensions',
    highlightLines: [2, 5, 8, 9, 10, 11]
  },
  {
    id: 'base-extension-commands',
    code: `getCommands(editor: LexicalEditor): TestCommands {
  return {
    insertTimestamp: () => {
      editor.focus();
      const timestamp = new Date().toLocaleString();
      editor.update(() => {
        const root = $getRoot();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(timestamp));
        root.append(paragraph);
      });
    },

    clearContent: () => {
      editor.update(() => {
        $getRoot().clear();
      });
    },

    getWordCount: () => {
      alert('Hello World from BaseExtension!');
    }
  };
}`,
    language: 'typescript',
    title: 'BaseExtension Commands',
    description: 'Implement getCommands method for BaseExtension',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 17, 18, 19]
  },
  {
    id: 'base-extension-state-queries',
    code: `getStateQueries(editor: LexicalEditor): TestStateQueries {
  return {
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
  };
}`,
    language: 'typescript',
    title: 'BaseExtension State Queries',
    description: 'Implement getStateQueries method for BaseExtension',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17]
  },
]

// Styling examples
export const STYLING_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'custom-styling',
    code: `.my-editor {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.my-editor .editor-content {
  padding: 16px;
  min-height: 200px;
  font-size: 16px;
  line-height: 1.6;
}`,
    language: 'css',
    title: 'Custom CSS Styling',
    description: 'Style your editor with custom CSS',
    highlightLines: [1, 2, 3, 4, 7, 8, 9, 10, 11]
  },
  {
    id: 'tailwind-styling',
    code: `<div className="border-2 border-gray-200 rounded-lg overflow-hidden">
  <div className="p-4 min-h-[200px] prose prose-sm max-w-none">
    {/* Editor content */}
  </div>
</div>`,
    language: 'tsx',
    title: 'Tailwind CSS Classes',
    description: 'Style with Tailwind utility classes',
    highlightLines: [1, 2, 3, 4]
  },
  {
    id: 'theme-integration',
    code: `function ThemedEditor() {
  const [theme, setTheme] = useState('light')

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <DefaultTemplate
        className={theme === 'dark' ? 'dark-theme' : 'light-theme'}
      />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  )
}`,
    language: 'tsx',
    title: 'Theme Integration',
    description: 'Implement light/dark theme switching',
    highlightLines: [3, 5, 6, 7, 10, 11, 12]
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
