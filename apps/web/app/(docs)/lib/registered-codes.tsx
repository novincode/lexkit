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
