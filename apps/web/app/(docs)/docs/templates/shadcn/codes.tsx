import { RegisteredCodeSnippet } from '@/app/(docs)/lib/types'

const SHADCN_TEMPLATE_CODES: RegisteredCodeSnippet[] = [
  {
    id: 'shadcn-template-basic-usage',
    code: `import { ShadcnTemplate } from '@lexkit/editor/templates'

function MyEditor() {
  return (
    <ShadcnTemplate
      onReady={(editor) => {
        console.log('Editor ready!')
        // Access editor methods here
        editor.injectMarkdown('# Hello World')
      }}
    />
  )
}`,
    language: 'tsx',
    title: 'Basic ShadcnTemplate Usage',
    description: 'Create a basic editor with the ShadcnTemplate'
  },
  {
    id: 'shadcn-template-with-ref',
    code: `import { useRef } from 'react'
import { ShadcnTemplate, ShadcnTemplateRef } from '@lexkit/editor/templates'

function MyEditor() {
  const editorRef = useRef<ShadcnTemplateRef>(null)

  const handleSave = () => {
    const markdown = editorRef.current?.getMarkdown()
    const html = editorRef.current?.getHTML()
    console.log('Content:', { markdown, html })
  }

  return (
    <div>
      <ShadcnTemplate ref={editorRef} />
      <button onClick={handleSave}>Save Content</button>
    </div>
  )
}`,
    language: 'tsx',
    title: 'ShadcnTemplate with Ref',
    description: 'Access editor methods using a ref'
  },
  {
    id: 'shadcn-template-extensions',
    code: `import {
  boldExtension,
  italicExtension,
  linkExtension,
  listExtension,
  imageExtension,
  tableExtension,
  codeExtension,
  // ... many more extensions
} from '@lexkit/editor'

const extensions = [
  boldExtension,
  italicExtension,
  linkExtension.configure({
    linkSelectedTextOnPaste: true,
    autoLinkText: true,
    autoLinkUrls: true
  }),
  listExtension,
  imageExtension,
  tableExtension,
  codeExtension,
  // ... add more extensions as needed
] as const`,
    language: 'typescript',
    title: 'ShadcnTemplate Extensions',
    description: 'Configure extensions for the ShadcnTemplate'
  },
  {
    id: 'shadcn-template-create-system',
    code: `import { createEditorSystem } from '@lexkit/editor'

// Define your extensions
const extensions = [boldExtension, italicExtension] as const

// Create a typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Extract types for type safety
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>
type EditorStateQueries = ExtractStateQueries<typeof extensions>`,
    language: 'typescript',
    title: 'Create Editor System',
    description: 'Set up a typed editor system with extensions'
  },
  {
    id: 'shadcn-template-toolbar',
    code: `function Toolbar({ commands, activeStates }: {
  commands: EditorCommands
  activeStates: EditorStateQueries
}) {
  return (
    <div className="toolbar">
      <button
        onClick={() => commands.bold()}
        className={activeStates.isBold() ? 'active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => commands.italic()}
        className={activeStates.isItalic() ? 'active' : ''}
      >
        Italic
      </button>
    </div>
  )
}`,
    language: 'tsx',
    title: 'Custom Toolbar',
    description: 'Create a custom toolbar with command buttons'
  },
  {
    id: 'shadcn-template-theme',
    code: `import { shadcnTheme } from '@lexkit/editor/templates'

// Use the built-in shadcn theme
<ShadcnTemplate />

// Or customize it
const customTheme = {
  ...shadcnTheme,
  toolbar: {
    group: 'flex items-center gap-1 p-2 border-b bg-background'
  },
  editor: 'min-h-[400px] p-4 focus:outline-none',
  // ... override specific styles
}

<ShadcnTemplate theme={customTheme} />`,
    language: 'typescript',
    title: 'ShadcnTemplate Theme',
    description: 'Apply custom CSS classes with a theme object'
  },
  {
    id: 'shadcn-template-css-variables',
    code: `:root {
  --editor-bg: #ffffff;
  --editor-text: #000000;
  --toolbar-bg: #f5f5f5;
  --button-hover: #e5e5e5;
}

.dark {
  --editor-bg: #1a1a1a;
  --editor-text: #ffffff;
  --toolbar-bg: #2a2a2a;
  --button-hover: #3a3a3a;
}`,
    language: 'css',
    title: 'CSS Variables for Theming',
    description: 'Use CSS variables for dynamic theming'
  },
  {
    id: 'shadcn-template-command-palette',
    code: `import { commandPaletteExtension } from '@lexkit/editor'

// Add to extensions array
const extensions = [
  // ... other extensions
  commandPaletteExtension,
] as const

// In your component
function MyEditor() {
  const { commands } = useEditor()

  const openCommandPalette = () => {
    // Command palette will show all available commands
    commands.openCommandPalette?.()
  }

  return (
    <div>
      <button onClick={openCommandPalette}>
        Open Command Palette (Ctrl+K)
      </button>
      <ShadcnTemplate />
    </div>
  )
}`,
    language: 'tsx',
    title: 'Command Palette',
    description: 'Add a command palette for keyboard-driven editing'
  },
  {
    id: 'shadcn-template-image-handling',
    code: `function ImageHandler({ commands }: { commands: EditorCommands }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertImageFromFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Convert to base64 or upload to server
      const base64 = await fileToBase64(file)
      commands.insertImage?.({
        src: base64,
        alt: file.name
      })
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <button onClick={insertImageFromFile}>
        Insert Image
      </button>
    </div>
  )
}`,
    language: 'tsx',
    title: 'Image Handling',
    description: 'Handle image uploads and insertion'
  },
  {
    id: 'shadcn-template-markdown-import',
    code: `import { markdownExtension } from '@lexkit/editor'

// Add to extensions
const extensions = [
  // ... other extensions
  markdownExtension.configure({
    customTransformers: ALL_MARKDOWN_TRANSFORMERS
  })
] as const

// Usage
function MyEditor() {
  const editorRef = useRef<ShadcnTemplateRef>(null)

  const loadMarkdown = () => {
    editorRef.current?.injectMarkdown(\`
# Hello World

This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`)
  }

  return <ShadcnTemplate ref={editorRef} onReady={loadMarkdown} />
}`,
    language: 'tsx',
    title: 'Markdown Support',
    description: 'Import and export markdown content'
  },
  {
    id: 'shadcn-template-floating-toolbar',
    code: `// The ShadcnTemplate includes a floating toolbar by default
// It appears when you select text and provides formatting options

<ShadcnTemplate />

// The floating toolbar includes:
// - Text formatting (bold, italic, underline, strikethrough)
// - Code formatting
// - Link creation/removal
// - List toggles (unordered/ordered)`,
    language: 'tsx',
    title: 'Floating Toolbar',
    description: 'Contextual formatting toolbar that appears on text selection'
  },
  {
    id: 'shadcn-template-draggable-blocks',
    code: `// The ShadcnTemplate includes draggable blocks by default
// Hover over the left edge of content blocks to see drag handles

<ShadcnTemplate />

// Features:
// - Drag blocks to reorder content
// - Visual feedback during dragging
// - Smooth animations
// - Works with all content types (paragraphs, headings, lists, etc.)`,
    language: 'tsx',
    title: 'Draggable Blocks',
    description: 'Drag and drop content blocks to reorder your document'
  },
  {
    id: 'shadcn-template-context-menu',
    code: `// The ShadcnTemplate includes a context menu by default
// Right-click on content to see formatting options

<ShadcnTemplate />

// The context menu provides:
// - Text formatting options
// - Block-level commands
// - Quick access to common actions`,
    language: 'tsx',
    title: 'Context Menu',
    description: 'Right-click context menu for quick formatting actions'
  }
]

export default SHADCN_TEMPLATE_CODES
