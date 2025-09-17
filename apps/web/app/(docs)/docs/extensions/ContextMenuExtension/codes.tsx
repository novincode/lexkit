import { RegisteredCodeSnippet } from "../../../lib/types";

const CONTEXT_MENU_EXTENSION_CODES: RegisteredCodeSnippet[] = [
  {
    id: "context-menu-import",
    code: `import { contextMenuExtension } from '@lexkit/editor/extensions'
import { DefaultTemplate } from '@lexkit/editor/templates'`,
    language: "typescript",
    title: "Import ContextMenuExtension",
    description: "Import the extension and template",
  },
  {
    id: "context-menu-basic-usage",
    code: `function MyEditor() {
  return (
    <DefaultTemplate
      extensions={[contextMenuExtension]}
      onReady={(editor) => {
        console.log('Editor with context menu ready!')
      }}
    />
  )
}`,
    language: "tsx",
    title: "Basic Usage",
    description: "Add context menu support to your editor",
    highlightLines: [3, 4, 5, 6],
  },
  {
    id: "context-menu-provider-registration",
    code: `function MyEditor() {
  const { commands } = useEditor()

  useEffect(() => {
    // Register a custom context menu provider
    commands.registerProvider({
      id: 'my-custom-provider',
      priority: 50,
      canHandle: ({ target, selection }) => {
        // Check if we're in a paragraph
        return target.closest('p') !== null
      },
      getItems: ({ editor }) => [
        {
          label: 'Custom Action',
          action: () => {
            console.log('Custom action triggered!')
          }
        }
      ]
    })
  }, [commands])

  return <DefaultTemplate extensions={[contextMenuExtension]} />
}`,
    language: "tsx",
    title: "Register Custom Providers",
    description: "Add custom context menu items for specific content",
    highlightLines: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  {
    id: "context-menu-table-integration",
    code: `import { TableExtension } from '@lexkit/editor/extensions'

// Configure table extension with context menu
const tableWithContextMenu = new TableExtension().configure({
  enableContextMenu: true, // Enable table context menus
  contextMenuItems: [
    {
      label: "Insert Row Above",
      action: () => commands.insertRowAbove(),
    },
    {
      label: "Insert Row Below",
      action: () => commands.insertRowBelow(),
    },
    {
      label: "Delete Row",
      action: () => commands.deleteRow(),
    }
  ]
})

const extensions = [
  contextMenuExtension, // Must come before table extension
  tableWithContextMenu
] as const`,
    language: "tsx",
    title: "Table Integration",
    description: "Enable context menus for table operations",
    highlightLines: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  },
  {
    id: "context-menu-custom-renderer",
    code: `function CustomContextMenuRenderer(props) {
  const { items, position, onClose } = props

  return createPortal(
    <div
      className="my-custom-context-menu"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: '200px',
        zIndex: 9999
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="menu-item"
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none'
          }}
          onClick={() => {
            item.action()
            onClose()
          }}
        >
          {item.label}
        </div>
      ))}
    </div>,
    document.body
  )
}

// Use custom renderer
const customContextMenu = contextMenuExtension.configure({
  defaultRenderer: CustomContextMenuRenderer
})`,
    language: "tsx",
    title: "Custom Renderer",
    description: "Create custom context menu styling and behavior",
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: "context-menu-programmatic-control",
    code: `function MyToolbar() {
  const { commands, activeStates } = useEditor()

  const showCustomMenu = () => {
    commands.showContextMenu({
      items: [
        { label: 'Option 1', action: () => console.log('Option 1') },
        { label: 'Option 2', action: () => console.log('Option 2') }
      ],
      position: { x: 100, y: 100 }
    })
  }

  const hideMenu = () => {
    commands.hideContextMenu()
  }

  return (
    <div>
      <button onClick={showCustomMenu}>
        Show Custom Menu
      </button>
      <button onClick={hideMenu}>
        Hide Menu
      </button>
    </div>
  )
}`,
    language: "tsx",
    title: "Programmatic Control",
    description: "Show and hide context menus programmatically",
    highlightLines: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  },
  {
    id: "context-menu-state-queries",
    code: `function MyComponent() {
  const { stateQueries } = useEditor()

  const checkMenuState = async () => {
    const isOpen = await stateQueries.isContextMenuOpen()
    console.log('Context menu is open:', isOpen)
  }

  useEffect(() => {
    checkMenuState()
  }, [])

  return <div>Context menu state checker</div>
}`,
    language: "tsx",
    title: "State Queries",
    description: "Check context menu state reactively",
    highlightLines: [4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: "context-menu-configuration",
    code: `const customContextMenu = contextMenuExtension.configure({
  preventDefault: true, // Prevent browser context menu
  initPriority: 100,   // High priority for early registration
  theme: {
    container: 'my-context-menu',
    item: 'my-menu-item',
    itemDisabled: 'my-menu-item-disabled'
  },
  styles: {
    container: {
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    },
    item: {
      padding: '12px 16px',
      fontSize: '14px'
    }
  }
})`,
    language: "tsx",
    title: "Configuration Options",
    description: "Customize context menu behavior and appearance",
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  },
];

export default CONTEXT_MENU_EXTENSION_CODES;