import { codeToHtml } from 'shiki'
import { RegisteredCodeSnippet } from './types'

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
      return new Promise(resolve => {
        editor.read(() => {
          const selection = $getSelection();
          resolve($isRangeSelection(selection) && !selection.isCollapsed());
        });
      });
    },

    isEmpty: async () => {
      return new Promise(resolve => {
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
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15]
  },
  {
    id: 'use-extension-commands',
    code: `function MyEditor() {
  const { commands, stateQueries } = useEditor()

  const handleInsertText = () => {
    commands.insertText('Hello World!')
  }

  const handleClear = () => {
    commands.clearEditor()
  }

  const checkSelection = async () => {
    const hasSelection = await stateQueries.hasSelection()
    console.log('Has selection:', hasSelection)
  }

  return (
    <div>
      <div className="mb-4 space-x-2">
        <button onClick={handleInsertText}>
          Insert Text
        </button>
        <button onClick={handleClear}>
          Clear Editor
        </button>
        <button onClick={checkSelection}>
          Check Selection
        </button>
      </div>

      <EditorContent />
    </div>
  )
}`,
    language: 'tsx',
    title: 'Using Extension Commands',
    description: 'Access and use extension commands in your components',
    highlightLines: [2, 4, 5, 6, 9, 10, 11, 14, 15, 16, 17, 18, 19]
  },
  {
    id: 'richtext-with-extensions',
    code: `import { createEditorSystem, richTextExtension, boldExtension, italicExtension, historyExtension } from "@lexkit/editor"

// Define your extensions (as const for type safety)
const extensions = [
  richTextExtension({
    placeholder: "Start writing...",
    classNames: {
      container: "my-editor-container",
      contentEditable: "my-editor-content",
      placeholder: "my-editor-placeholder"
    }
  }),
  boldExtension,
  italicExtension,
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

function MyEditor() {
  return (
    <Provider extensions={extensions}>
      <div className="my-editor">
        {/* RichText extension renders automatically */}
        {/* Add your toolbar or other UI here */}
      </div>
    </Provider>
  )
}`,
    language: 'tsx',
    title: 'RichText as Extension',
    description: 'Use RichText as a LexKit extension with createEditorSystem',
    highlightLines: [5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21]
  },
  {
    id: 'richtext-lexical-direct',
    code: `import { createEditorSystem, boldExtension, italicExtension, historyExtension } from "@lexkit/editor"
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'

// Define your extensions (without RichText extension)
const extensions = [
  boldExtension,
  italicExtension,
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()


  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Provider extensions={extensions}>
        <div className="my-editor">
          <RichTextPlugin
            contentEditable={<ContentEditable className="my-editor-content" />}
            placeholder={<div className="my-editor-placeholder">Start writing...</div>}
          />
          {/* Add your toolbar or other UI here */}
        </div>
      </Provider>
    </LexicalComposer>
  )
}`,
    language: 'tsx',
    title: 'RichText with Lexical Direct',
    description: 'Use createEditorSystem with manual RichTextPlugin setup',
    highlightLines: [5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  },
  {
    id: 'theming-with-lexkit',
    code: `// Define a custom theme with classnames
const simpleTheme: LexKitTheme = {
  // Editor content styles
  paragraph: 'lexkit-paragraph',
  heading: {
    h1: 'themed-heading-h1',
    h2: 'themed-heading-h2',
    h3: 'themed-heading-h3',
  },
  list: {
    ul: 'themed-list-ul',
    ol: 'themed-list-ol',
    listitem: 'themed-list-li',
  },
  quote: 'lexkit-quote',
  link: 'lexkit-link',
  text: {
    bold: 'lexkit-text-bold',
    italic: 'lexkit-text-italic',
    underline: 'lexkit-text-underline',
  },
}

const { Provider, useEditor } = createEditorSystem<typeof extensions>()

function ThemedEditor() {
  return (
    <Provider 
      extensions={extensions}
      config={{ theme: simpleTheme }}
    >
      <RichText placeholder="Themed editor content..." />
    </Provider>
  )
}`,
    language: 'tsx',
    title: 'Theming with LexKit',
    description: 'Apply custom themes to your LexKit editor',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
  }
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

// Combine all snippets for the registry
const ALL_SNIPPETS: RegisteredCodeSnippet[] = [
  ...INSTALLATION_EXAMPLES,
  ...BASIC_USAGE_EXAMPLES,
  ...EXTENSION_EXAMPLES,
  ...STYLING_EXAMPLES
]

export default ALL_SNIPPETS
