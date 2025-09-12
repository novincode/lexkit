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
    code: `import { createEditorSystem, linkExtension, blockFormatExtension, historyExtension, RichText } from '@lexkit/editor'

const extensions = [
  blockFormatExtension, // REQUIRED for LinkExtension paste functionality
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
    description: 'LinkExtension with RichText component (BlockFormatExtension REQUIRED)',
    highlightLines: [3, 4, 5, 6, 11, 12, 13, 14, 15]
  },
  {
    id: 'link-custom-usage',
    code: `import { createEditorSystem, linkExtension, blockFormatExtension, historyExtension, RichText } from '@lexkit/editor'

const extensions = [
  blockFormatExtension, // REQUIRED for LinkExtension paste functionality
  linkExtension.configure({
    autoLinkUrls: true,        // Auto-link pasted URLs
    linkSelectedTextOnPaste: true, // Link selected text when pasting URLs
    autoLinkText: false        // Don't auto-link as you type
  }),
  historyExtension
] as const

const { Provider, useEditor } = createEditorSystem<typeof extensions>()

function MyEditor() {
  const { commands, activeStates } = useEditor()

  return (
    <Provider extensions={extensions}>
      <div>
        <button onClick={() => commands.insertLink()}>
          Insert Link
        </button>
        <RichText placeholder="Start typing..." />
      </div>
    </Provider>
  )
}`,
    language: 'tsx',
    title: 'Custom Configuration',
    description: 'Configure LinkExtension behavior with createEditorSystem',
    highlightLines: [3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21]
  },
  {
    id: 'link-configuration',
    code: `import { createEditorSystem, linkExtension, blockFormatExtension, historyExtension, RichText } from '@lexkit/editor'

const linkConfig = {
  autoLinkUrls: true,           // Auto-link pasted URLs
  linkSelectedTextOnPaste: true, // Link selected text when pasting URLs
  autoLinkText: false,          // Auto-link URLs as you type
  validateUrl: (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

const extensions = [
  blockFormatExtension, // REQUIRED for LinkExtension paste functionality
  linkExtension.configure(linkConfig),
  historyExtension
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
    title: 'Configuration Options',
    description: 'Customize link behavior with configuration object',
    highlightLines: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
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
    code: `import { createEditorSystem, linkExtension, blockFormatExtension, historyExtension, RichText } from '@lexkit/editor'

// Configuration examples for different paste behaviors
// NOTE: BlockFormatExtension is REQUIRED for paste functionality to work

// 1. Auto-link everything (default)
const autoLinkAll = linkExtension.configure({
  autoLinkUrls: true,        // Auto-link pasted URLs
  linkSelectedTextOnPaste: true, // Link selected text when pasting URLs
  autoLinkText: true         // Auto-link URLs as you type
})

// 2. Only link when pasting over selected text
const selectiveLinking = linkExtension.configure({
  autoLinkUrls: true,        // Auto-link pasted URLs
  linkSelectedTextOnPaste: true, // Link selected text when pasting URLs
  autoLinkText: false        // Don't auto-link as you type
})

// 3. Manual linking only
const manualOnly = linkExtension.configure({
  autoLinkUrls: false,       // Don't auto-link pasted URLs
  linkSelectedTextOnPaste: false, // Don't link selected text on paste
  autoLinkText: false        // Don't auto-link as you type
})

// 4. Auto-link as you type, no paste linking
const typeLinking = linkExtension.configure({
  autoLinkUrls: false,       // Don't auto-link pasted URLs
  linkSelectedTextOnPaste: false, // Don't link selected text on paste
  autoLinkText: true         // Auto-link URLs as you type
})

// Usage with BlockFormatExtension
const extensions = [
  blockFormatExtension, // REQUIRED for LinkExtension paste functionality
  autoLinkAll,
  historyExtension
] as const

const { Provider } = createEditorSystem<typeof extensions>()`,
    language: 'tsx',
    title: 'Paste Behavior Examples',
    description: 'Different ways to handle URL pasting (BlockFormatExtension REQUIRED)',
    highlightLines: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
  },
  {
    id: 'link-custom-validation',
    code: `import { createEditorSystem, linkExtension, blockFormatExtension, historyExtension, RichText } from '@lexkit/editor'

const customLinkExtension = linkExtension.configure({
  validateUrl: (url: string) => {
    // Only allow HTTPS URLs
    return url.startsWith('https://')
  }
})

// Or more complex validation
const advancedValidation = linkExtension.configure({
  validateUrl: (url: string) => {
    try {
      const parsedUrl = new URL(url)

      // Only allow specific domains
      const allowedDomains = ['github.com', 'stackoverflow.com', 'example.com']
      return allowedDomains.includes(parsedUrl.hostname)
    } catch {
      return false
    }
  }
})

const extensions = [
  blockFormatExtension, // REQUIRED for LinkExtension paste functionality
  advancedValidation,
  historyExtension
] as const

const { Provider } = createEditorSystem<typeof extensions>()`,
    language: 'tsx',
    title: 'Custom URL Validation',
    description: 'Control which URLs are considered valid links',
    highlightLines: [1, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  }
]

export default LINK_EXTENSION_CODES
