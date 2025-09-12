import { RegisteredCodeSnippet } from '../../../lib/types'

export const LINK_EXTENSION_CODES: RegisteredCodeSnippet[] = [
  {
    id: 'link-extension-basic-usage',
    code: `import { createEditorSystem, linkExtension } from '@lexkit/editor'

const extensions = [linkExtension] as const
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

function MyEditor() {
  const { commands, activeStates } = useEditor()

  return (
    <Provider extensions={extensions}>
      <button
        onClick={() => commands.insertLink()}
        className={activeStates.isLink ? 'active' : ''}
      >
        Insert Link
      </button>
      <button
        onClick={() => commands.removeLink()}
        disabled={!activeStates.isLink}
      >
        Remove Link
      </button>
    </Provider>
  )
}`,
    language: 'tsx',
    title: 'Basic Link Extension Usage',
    description: 'Simple setup with manual link creation',
    highlightLines: [3, 4, 5, 10, 11, 12, 15, 16, 17]
  },
  {
    id: 'link-extension-auto-link-text',
    code: `import { linkExtension } from '@lexkit/editor'

const extensions = [
  linkExtension.configure({
    autoLinkText: true  // Auto-convert URLs as you type
  })
] as const`,
    language: 'typescript',
    title: 'Auto-Link Text Configuration',
    description: 'Enable automatic link creation when typing URLs',
    highlightLines: [4, 5]
  },
  {
    id: 'link-extension-custom-validation',
    code: `import { linkExtension } from '@lexkit/editor'

const extensions = [
  linkExtension.configure({
    autoLinkText: true,
    validateUrl: (url: string) => {
      // Custom URL validation
      return url.startsWith('https://') &&
             url.includes('example.com')
    }
  })
] as const`,
    language: 'typescript',
    title: 'Custom URL Validation',
    description: 'Use custom validation for URLs',
    highlightLines: [5, 6, 7, 8]
  },
  {
    id: 'link-extension-commands',
    code: `function LinkToolbar() {
  const { commands, activeStates } = useEditor()

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      commands.insertLink(url)
    }
  }

  const insertLinkWithText = () => {
    const url = prompt('Enter URL:')
    const text = prompt('Enter link text:')
    if (url && text) {
      commands.insertLink(url, text)
    }
  }

  return (
    <div>
      <button onClick={insertLink}>
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
    title: 'Link Commands Usage',
    description: 'Using link extension commands in components',
    highlightLines: [4, 5, 6, 7, 11, 12, 13, 14, 17, 18, 19, 20]
  },
  {
    id: 'link-extension-paste-behavior',
    code: `// LinkExtension Paste Behavior:
//
// 1. Pasting URL at cursor (no selection):
//    - Always creates a link automatically
//    - Example: Paste "https://example.com" → creates clickable link
//
// 2. Pasting URL over selected text:
//    - Uses Lexical's built-in behavior
//    - Converts selected text to link with pasted URL
//    - Example: Select "click here" + paste "https://example.com"
//              → "click here" becomes link to example.com
//
// 3. Pasting non-URL text:
//    - Normal paste behavior (no link creation)
//
// Note: autoLinkText setting only affects typing, not pasting`,
    language: 'typescript',
    title: 'Paste Behavior Explanation',
    description: 'How LinkExtension handles different paste scenarios',
    highlightLines: [3, 7, 11, 15, 19]
  },
  {
    id: 'link-extension-disable-auto-link-urls',
    code: `const extensions = [
  linkExtension.configure({
    autoLinkUrls: false  // Pasted URLs remain as plain text
  })
] as const`,
    language: 'typescript',
    title: 'Disable Auto-Link URLs',
    description: 'Disable automatic linking for pasted URLs'
  },
  {
    id: 'link-extension-link-selected-text-on-paste',
    code: `const extensions = [
  linkExtension.configure({
    linkSelectedTextOnPaste: false  // Replace selected text with URL instead of linking it
  })
] as const`,
    language: 'typescript',
    title: 'Control Selected Text Paste Behavior',
    description: 'Control behavior when pasting URLs over selected text'
  }
]

export default LINK_EXTENSION_CODES
