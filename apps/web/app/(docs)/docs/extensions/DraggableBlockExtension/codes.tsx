import { RegisteredCodeSnippet } from '../../../lib/types'

const DRAGGABLE_BLOCK_EXTENSION_CODES: RegisteredCodeSnippet[] = [
  {
    id: 'draggable-block-import',
    code: `import { DraggableBlockExtension } from '@lexkit/editor/extensions'
import { DefaultTemplate } from '@lexkit/editor/templates'`,
    language: 'typescript',
    title: 'Import DraggableBlockExtension',
    description: 'Import the extension and template'
  },
  {
    id: 'draggable-block-basic-usage',
    code: `function MyEditor() {
  return (
    <DefaultTemplate
      extensions={[DraggableBlockExtension]}
      onReady={(editor) => {
        console.log('Editor with drag-and-drop ready!')
      }}
    />
  )
}`,
    language: 'tsx',
    title: 'Basic Usage',
    description: 'Add drag-and-drop to your editor',
    highlightLines: [3, 4, 5, 6]
  },
  {
    id: 'draggable-block-configuration',
    code: `const draggableConfig = {
  dragHandle: true,           // Show drag handles
  dragHandleClass: 'custom-handle', // Custom CSS class
  animationDuration: 200,     // Animation duration in ms
  easing: 'ease-out',         // CSS easing function
  dropIndicator: true,        // Show drop indicator
  dropIndicatorClass: 'drop-zone', // Custom drop indicator class
  onDragStart: (node) => console.log('Drag started', node),
  onDragEnd: (node) => console.log('Drag ended', node),
  onDrop: (draggedNode, targetNode) => console.log('Dropped', draggedNode, targetNode)
}

function MyEditor() {
  return (
    <DefaultTemplate
      extensions={[new DraggableBlockExtension(draggableConfig)]}
    />
  )
}`,
    language: 'tsx',
    title: 'Configuration Options',
    description: 'Customize drag-and-drop behavior',
    highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  },
  {
    id: 'draggable-block-styling',
    code: `.draggable-block {
  position: relative;
  transition: transform 0.2s ease-out;
}

.draggable-block:hover .drag-handle {
  opacity: 1;
}

.drag-handle {
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  cursor: grab;
  padding: 4px;
  border-radius: 4px;
  background: var(--muted);
  transition: opacity 0.2s ease;
}

.drag-handle:hover {
  background: var(--accent);
}

.drag-handle:active {
  cursor: grabbing;
}

.drop-indicator {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.drop-indicator.active {
  opacity: 1;
}`,
    language: 'css',
    title: 'Custom Styling',
    description: 'Style drag handles and drop indicators'
  },
  {
    id: 'draggable-block-events',
    code: `function MyEditor() {
  const handleDragStart = (node) => {
    console.log('Started dragging:', node.getType())
  }

  const handleDrop = (draggedNode, targetNode) => {
    // Custom logic when blocks are reordered
    console.log('Reordered blocks')

    // You can access the editor instance for more complex operations
    // editor.update(() => { ... })
  }

  return (
    <DefaultTemplate
      extensions={[new DraggableBlockExtension({
        onDragStart: handleDragStart,
        onDrop: handleDrop
      })]}
    />
  )
}`,
    language: 'tsx',
    title: 'Event Handling',
    description: 'Handle drag-and-drop events',
    highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  }
]

export default DRAGGABLE_BLOCK_EXTENSION_CODES
