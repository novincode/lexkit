import { RegisteredCodeSnippet } from '../../../lib/types'

const LINK_EXTENSION_CODES: RegisteredCodeSnippet[] = [
  {
    id: 'link-import',
    code: `import { linkExtension } from '@lexkit/editor/extensions'
import { DefaultTemplate } from '@lexkit/editor/templates'`,
    language: 'typescript',
    title: 'Import LinkExtension',
    description: 'Import the extension and template'
  },
  {
    id: 'link-basic-usage',
    code: `import { createEditorSystem, linkExtension, historyExtension, RichText } from '@lexkit/editor'

const extensions = [
  linkExtension,        // Basic link functionality
  historyExtension      // Undo/redo support
] as const

const { Provider, useEditor } = createEditorSystem<typeof extensions>()

function MyEditor() {
  return (
    <Provider extensions={extensions}>
      <RichText placeholder="Start typing..." />
    </Provider>
  )
}`,
    language: 'tsx',
    title: 'Basic Usage with RichText',
    description: 'LinkExtension with RichText component',
    highlightLines: [3, 4, 5, 6, 11, 12, 13, 14, 15]
  },
  {
    id: 'link-auto-link-urls',
    code: `import { createEditorSystem, linkExtension, historyExtension, RichText } from '@lexkit/editor'

const extensions = [
  linkExtension.configure({
    autoLinkUrls: false,    // Don't auto-link pasted URLs
    autoLinkText: true      // But auto-link URLs as you type
  }),
  historyExtension
] as const

const { Provider, useEditor } = createEditorSystem<typeof extensions>()

function MyEditor() {
  return (
    <Provider extensions={extensions}>
      <RichText placeholder="Paste URLs - they'll remain as plain text. Type URLs to auto-link them..." />
    </Provider>
  )
}`,
    language: 'tsx',
    title: 'Manual URL Pasting',
    description: 'Disable auto-linking of pasted URLs while keeping auto-linking as you type',
    highlightLines: [3, 4, 5, 6, 7, 8, 13, 14, 15, 16, 17]
  },
  {
    id: 'link-commands',
    code: `function MyEditor() {
  const { commands, activeStates } = useEditor()

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      commands.insertLink(url)
    }
  }

  const insertLinkWithText = () => {
    const text = prompt('Enter link text:')
    const url = prompt('Enter URL:')
    if (text && url) {
      commands.insertLink(url, text)
    }
  }

  return (
    <div>
      <button
        onClick={insertLink}
        className={activeStates.isLink ? 'active' : ''}
      >
        Insert Link
      </button>
      <button onClick={insertLinkWithText}>
        Insert Link with Text
      </button>
      <button
        onClick={() => commands.removeLink()}
        disabled={!activeStates.isLink}
      >
        Remove Link
      </button>
    </div>
  )
}`,
    language: 'tsx',
    title: 'Using Link Commands',
    description: 'Programmatically create and manage links',
    highlightLines: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  },
  {
    id: 'link-paste-behavior',
    code: `import { createEditorSystem, linkExtension, historyExtension, RichText } from '@lexkit/editor'

// Replace selected text when pasting URLs
const replaceOnPaste = linkExtension.configure({
  linkSelectedTextOnPaste: false  // Replace selected text with pasted URL
})

// Link selected text when pasting URLs (default)
const linkOnPaste = linkExtension.configure({
  linkSelectedTextOnPaste: true   // Link selected text with pasted URL
})

const extensions = [
  linkOnPaste,  // or replaceOnPaste
  historyExtension
] as const

const { Provider } = createEditorSystem<typeof extensions>()`,
    language: 'tsx',
    title: 'Paste Behavior Options',
    description: 'Control how URLs are handled when pasted over selected text',
    highlightLines: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  },
]

export default LINK_EXTENSION_CODES
