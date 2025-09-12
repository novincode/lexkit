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
    code: `function MyEditor() {
  return (
    <DefaultTemplate
      extensions={[linkExtension]}
      onReady={(editor) => {
        console.log('Editor with links ready!')
      }}
    />
  )
}`,
    language: 'tsx',
    title: 'Basic Usage',
    description: 'Add link functionality to your editor',
    highlightLines: [3, 4, 5, 6]
  },
  {
    id: 'link-configuration',
    code: `const linkConfig = {
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

function MyEditor() {
  return (
    <DefaultTemplate
      extensions={[linkExtension.configure(linkConfig)]}
    />
  )
}`,
    language: 'tsx',
    title: 'Configuration Options',
    description: 'Customize link behavior',
    highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
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
    code: `// Configuration examples for different paste behaviors

// 1. Auto-link everything (default)
const autoLinkAll = linkExtension.configure({
  autoLinkUrls: true,
  linkSelectedTextOnPaste: true,
  autoLinkText: true
})

// 2. Only link when pasting over selected text
const selectiveLinking = linkExtension.configure({
  autoLinkUrls: true,
  linkSelectedTextOnPaste: true,
  autoLinkText: false
})

// 3. Manual linking only
const manualOnly = linkExtension.configure({
  autoLinkUrls: false,
  linkSelectedTextOnPaste: false,
  autoLinkText: false
})

// 4. Auto-link as you type, no paste linking
const typeLinking = linkExtension.configure({
  autoLinkUrls: false,
  linkSelectedTextOnPaste: false,
  autoLinkText: true
})`,
    language: 'tsx',
    title: 'Paste Behavior Examples',
    description: 'Different ways to handle URL pasting',
    highlightLines: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
  },
  {
    id: 'link-custom-validation',
    code: `const customLinkExtension = linkExtension.configure({
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
})`,
    language: 'tsx',
    title: 'Custom URL Validation',
    description: 'Control which URLs are considered valid links',
    highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
  }
]

export default LINK_EXTENSION_CODES
