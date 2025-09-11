import { RegisteredCodeSnippet } from '../../lib/types'

// Introduction examples - basic getting started snippets
export const INTRODUCTION_EXAMPLES: RegisteredCodeSnippet[] = [
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

// Combine all examples for default export
export default INTRODUCTION_EXAMPLES
