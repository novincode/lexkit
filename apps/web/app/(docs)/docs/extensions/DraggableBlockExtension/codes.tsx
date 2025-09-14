import { RegisteredCodeSnippet } from "../../../lib/types";

const DRAGGABLE_BLOCK_EXTENSION_CODES: RegisteredCodeSnippet[] = [
  {
    id: "draggable-block-import",
    code: `import { draggableBlockExtension } from '@lexkit/editor/extensions'
import { DefaultTemplate } from '@lexkit/editor/templates'`,
    language: "typescript",
    title: "Import DraggableBlockExtension",
    description: "Import the extension and template",
  },
  {
    id: "draggable-block-basic-usage",
    code: `function MyEditor() {
  return (
    <DefaultTemplate
      extensions={[draggableBlockExtension]}
      onReady={(editor) => {
        console.log('Editor with drag-and-drop ready!')
      }}
    />
  )
}`,
    language: "tsx",
    title: "Basic Usage",
    description: "Add drag-and-drop to your editor",
    highlightLines: [3, 4, 5, 6],
  },
  {
    id: "draggable-block-configuration",
    code: `const extensionsWithDraggable = [
  draggableBlockExtension.configure({
    showMoveButtons: true,        // Show up/down buttons
    showUpButton: true,           // Enable move up button
    showDownButton: true,         // Enable move down button
    buttonStackPosition: 'left',  // Position buttons on left
    enableTextSelectionDrag: true, // Allow dragging via text selection
    theme: {
      handle: 'my-drag-handle',
      handleActive: 'my-drag-handle-active',
      blockDragging: 'my-block-dragging',
      dropIndicator: 'my-drop-indicator'
    }
  }),
  historyExtension
] as const`,
    language: "tsx",
    title: "Configuration Options",
    description: "Customize drag-and-drop behavior",
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  {
    id: "draggable-block-styling",
    code: `.my-drag-handle {
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: grab;
}

.my-drag-handle:hover {
  opacity: 1;
}

.my-drag-handle-active {
  opacity: 1;
  cursor: grabbing;
}

.my-block-dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.my-drop-indicator {
  height: 2px;
  background: #007acc;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.my-drop-indicator.active {
  opacity: 1;
}`,
    language: "css",
    title: "Custom Styling",
    description: "Style drag handles and drop indicators",
  },
  {
    id: "draggable-block-events",
    code: `function MyEditor() {
  const handleDragStart = () => {
    console.log('Drag started')
  }

  const handleDrop = (sourceKey: string, targetKey: string) => {
    console.log('Block moved from', sourceKey, 'to', targetKey)
  }

  const extensions = [
    draggableBlockExtension.configure({
      // Custom renderers for full control
      handleRenderer: ({ rect, isDragging, onDragStart }) => (
        <div
          style={{
            position: 'absolute',
            left: rect.left - 20,
            top: rect.top + rect.height / 2 - 10,
            width: 16,
            height: 16,
            background: isDragging ? '#007acc' : '#ccc',
            cursor: 'grab'
          }}
          onMouseDown={onDragStart}
        >
          ⋮⋮
        </div>
      )
    })
  ] as const

  return <DefaultTemplate extensions={extensions} />
}`,
    language: "tsx",
    title: "Custom Handle Renderer",
    description: "Create custom drag handles with full control",
    highlightLines: [
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    ],
  },
  {
    id: "draggable-block-reactive-state",
    code: `function MyToolbar() {
  const { commands, activeStates } = useEditor()

  // Reactive state - updates immediately when dragging starts/stops
  const isDragging = activeStates?.isDragging || false

  return (
    <div className="toolbar">
      <button onClick={() => commands.moveCurrentBlockUp()}>
        Move Up
      </button>
      <button onClick={() => commands.moveCurrentBlockDown()}>
        Move Down
      </button>

      {/* Real-time drag state indicator */}
      <div className="drag-status">
        Dragging: {isDragging ? 'Yes' : 'No'}
      </div>
    </div>
  )
}`,
    language: "tsx",
    title: "Reactive State Usage",
    description: "Access drag state reactively without polling",
    highlightLines: [5, 6, 17],
  },
  {
    id: "draggable-block-commands",
    code: `function MyEditor() {
  const { commands, activeStates } = useEditor()

  const handleMoveBlock = () => {
    // Move a specific block programmatically
    commands.moveBlock('block-1', 'block-2', true)
  }

  const handleMoveCurrent = () => {
    // Move the currently selected block
    commands.moveCurrentBlockUp()
    // or
    commands.moveCurrentBlockDown()
  }

  return (
    <div>
      <button onClick={handleMoveBlock}>
        Move Block 1 After Block 2
      </button>
      <button onClick={handleMoveCurrent}>
        Move Current Block Up
      </button>
    </div>
  )
}`,
    language: "tsx",
    title: "Using Commands",
    description: "Programmatically control block movement",
    highlightLines: [6, 11, 12, 13, 14, 15, 16],
  },
];

export default DRAGGABLE_BLOCK_EXTENSION_CODES;
