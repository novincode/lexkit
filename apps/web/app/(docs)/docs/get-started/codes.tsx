import { RegisteredCodeSnippet } from '../../lib/types'

// Installation examples
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
    language: 'typescript',
    title: 'Rich Text with Extensions',
    description: 'Create a rich text editor with multiple extensions',
    highlightLines: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
  },
  {
    id: 'richtext-as-extension',
    code: `import { createEditorSystem, richTextExtension } from "@lexkit/editor"

// Define your extensions
const extensions = [
  richTextExtension({
    placeholder: "Start writing...",
    classNames: {
      container: "my-editor-container",
      contentEditable: "my-editor-content",
      placeholder: "my-editor-placeholder"
    }
  })
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

// Combine all examples for default export
export default [
  ...INSTALLATION_EXAMPLES,
  ...BASIC_USAGE_EXAMPLES
]
