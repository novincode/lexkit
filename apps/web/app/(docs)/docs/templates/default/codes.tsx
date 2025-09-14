import { RegisteredCodeSnippet } from "@/app/(docs)/lib/types";

const DEFAULT_TEMPLATE_CODES: RegisteredCodeSnippet[] = [
  {
    id: "default-template-basic-usage",
    code: `import { DefaultTemplate } from '@lexkit/editor/templates'

function MyEditor() {
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
    language: "tsx",
    title: "Basic DefaultTemplate Usage",
    description: "Create a basic editor with the DefaultTemplate",
  },
  {
    id: "default-template-with-ref",
    code: `import { useRef } from 'react'
import { DefaultTemplate, DefaultTemplateRef } from '@lexkit/editor/templates'

function MyEditor() {
  const editorRef = useRef<DefaultTemplateRef>(null)

  const handleSave = () => {
    const markdown = editorRef.current?.getMarkdown()
    const html = editorRef.current?.getHTML()
    console.log('Content:', { markdown, html })
  }

  return (
    <div>
      <DefaultTemplate ref={editorRef} />
      <button onClick={handleSave}>Save Content</button>
    </div>
  )
}`,
    language: "tsx",
    title: "DefaultTemplate with Ref",
    description: "Access editor methods using a ref",
  },
  {
    id: "default-template-extensions",
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
    language: "typescript",
    title: "DefaultTemplate Extensions",
    description: "Configure extensions for the DefaultTemplate",
  },
  {
    id: "default-template-create-system",
    code: `import { createEditorSystem } from '@lexkit/editor'

// Define your extensions
const extensions = [boldExtension, italicExtension] as const

// Create a typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Extract types for type safety
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>
type EditorStateQueries = ExtractStateQueries<typeof extensions>`,
    language: "typescript",
    title: "Create Editor System",
    description: "Set up a typed editor system with extensions",
  },
  {
    id: "default-template-toolbar",
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
    language: "tsx",
    title: "Custom Toolbar",
    description: "Create a custom toolbar with command buttons",
  },
  {
    id: "default-template-theme",
    code: `const customTheme = {
  toolbar: 'my-toolbar',
  editor: 'my-editor',
  contentEditable: 'my-content-editable',
  paragraph: 'my-paragraph',
  heading: {
    h1: 'my-h1',
    h2: 'my-h2',
    // ... more heading styles
  },
  text: {
    bold: 'my-bold',
    italic: 'my-italic',
    // ... more text styles
  }
  // ... complete theme object
}

<DefaultTemplate theme={customTheme} />`,
    language: "typescript",
    title: "Custom Theme",
    description: "Apply custom CSS classes with a theme object",
  },
  {
    id: "default-template-css-variables",
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
    language: "css",
    title: "CSS Variables for Theming",
    description: "Use CSS variables for dynamic theming",
  },
  {
    id: "default-template-command-palette",
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
      <DefaultTemplate />
    </div>
  )
}`,
    language: "tsx",
    title: "Command Palette",
    description: "Add a command palette for keyboard-driven editing",
  },
  {
    id: "default-template-image-handling",
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
    language: "tsx",
    title: "Image Handling",
    description: "Handle image uploads and insertion",
  },
  {
    id: "default-template-markdown-import",
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
  const editorRef = useRef<DefaultTemplateRef>(null)

  const loadMarkdown = () => {
    editorRef.current?.injectMarkdown(\`
# Hello World

This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`)
  }

  return <DefaultTemplate ref={editorRef} onReady={loadMarkdown} />
}`,
    language: "tsx",
    title: "Markdown Support",
    description: "Import and export markdown content",
  },
];

export default DEFAULT_TEMPLATE_CODES;
