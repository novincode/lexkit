import { RegisteredCodeSnippet } from '@/app/(docs)/lib/types'

export const CREATE_EDITOR_SYSTEM_CODES: RegisteredCodeSnippet[] = [
  {
    id: 'create-editor-system-basic-usage',
    code: `import { createEditorSystem } from '@lexkit/editor'
import { boldExtension, italicExtension } from '@lexkit/editor'

// Define your extensions as a const array for type safety
const extensions = [boldExtension, italicExtension] as const

// Create a typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

function MyEditor() {
  return (
    <Provider extensions={extensions}>
      <EditorContent />
    </Provider>
  )
}`,
    language: 'typescript',
    title: 'Basic Usage',
    description: 'Create a typed editor system with extensions',
    highlightLines: [5, 8, 10, 11, 12, 13, 14, 15]
  },
  {
    id: 'create-editor-system-with-config',
    code: `import { createEditorSystem, defaultLexKitTheme } from '@lexkit/editor'

const extensions = [boldExtension, italicExtension] as const
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

const customTheme = {
  ...defaultLexKitTheme,
  text: {
    bold: 'font-bold text-blue-600',
  },
}

function MyEditor() {
  return (
    <Provider
      extensions={extensions}
      config={{
        theme: customTheme,
        // other config options...
      }}
    >
      <EditorContent />
    </Provider>
  )
}`,
    language: 'typescript',
    title: 'With Configuration',
    description: 'Configure the editor with custom theme and settings',
    highlightLines: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
  },
  {
    id: 'create-editor-system-using-commands',
    code: `function EditorToolbar() {
  const { commands, activeStates } = useEditor()

  return (
    <div className="toolbar">
      <button
        onClick={() => commands.formatText('bold')}
        className={activeStates.bold ? 'active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => commands.formatText('italic')}
        className={activeStates.italic ? 'active' : ''}
      >
        Italic
      </button>
    </div>
  )
}`,
    language: 'typescript',
    title: 'Using Commands',
    description: 'Access commands and state through the useEditor hook',
    highlightLines: [2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  },
  {
    id: 'create-editor-system-type-safety',
    code: `// ✅ Type-safe: Only commands from your extensions are available
const { commands } = useEditor()

commands.formatText('bold')        // ✅ Available (from boldExtension)
commands.insertLink('url', 'text') // ✅ Available (if linkExtension is included)
// commands.someOtherCommand()     // ❌ TypeScript error - not available

// ✅ Type-safe state queries
const { activeStates } = useEditor()

activeStates.bold     // ✅ boolean
activeStates.italic   // ✅ boolean
activeStates.isLink   // ✅ boolean (if linkExtension is included)
// activeStates.unknown // ❌ TypeScript error - not available`,
    language: 'typescript',
    title: 'Type Safety',
    description: 'Full TypeScript support with compile-time validation',
    highlightLines: [3, 4, 5, 7, 9, 10, 11, 12]
  },
  {
    id: 'create-editor-system-multiple-editors',
    code: `// Different editor configurations for different use cases
const basicExtensions = [boldExtension, italicExtension] as const
const richExtensions = [
  ...basicExtensions,
  linkExtension,
  listExtension,
  imageExtension
] as const

const BasicEditorSystem = createEditorSystem<typeof basicExtensions>()
const RichEditorSystem = createEditorSystem<typeof richExtensions>()

// Comment editor - basic features
function CommentEditor() {
  return (
    <BasicEditorSystem.Provider extensions={basicExtensions}>
      <BasicEditorContent />
    </BasicEditorSystem.Provider>
  )
}

// Content editor - full features
function ContentEditor() {
  return (
    <RichEditorSystem.Provider extensions={richExtensions}>
      <RichEditorContent />
    </RichEditorSystem.Provider>
  )
}`,
    language: 'typescript',
    title: 'Multiple Editor Types',
    description: 'Create different editor systems for different use cases',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
  },
  {
    id: 'create-editor-system-advanced-state',
    code: `function AdvancedEditor() {
  const {
    commands,
    activeStates,
    stateQueries,
    editor,
    export: exportUtils,
    import: importUtils
  } = useEditor()

  // Use reactive state queries
  const handleCustomAction = async () => {
    const isLink = await stateQueries.isLink()
    if (isLink) {
      // Handle link-specific logic
    }
  }

  // Export/import functionality
  const saveContent = async () => {
    const html = await exportUtils.toHTML()
    const json = exportUtils.toJSON()
    // Save to your backend...
  }

  return (
    <div>
      <button onClick={handleCustomAction}>
        Custom Action
      </button>
      <button onClick={saveContent}>
        Save
      </button>
    </div>
  )
}`,
    language: 'typescript',
    title: 'Advanced State Management',
    description: 'Access advanced features like state queries and export/import',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  },
  {
    id: 'create-editor-system-define-extensions',
    code: `import { boldExtension, italicExtension, linkExtension } from '@lexkit/editor'

const extensions = [boldExtension, italicExtension, linkExtension] as const`,
    language: 'typescript',
    title: 'Define extensions array',
    description: 'Create a const array of extensions for type safety'
  },
  {
    id: 'create-editor-system-create-system',
    code: `import { createEditorSystem } from '@lexkit/editor'

const { Provider, useEditor } = createEditorSystem<typeof extensions>()`,
    language: 'typescript',
    title: 'Create typed editor system',
    description: 'Use createEditorSystem with your extensions to generate typed components'
  },
]

export default CREATE_EDITOR_SYSTEM_CODES
