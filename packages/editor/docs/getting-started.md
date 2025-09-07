# Getting Started with LexKit

## Installation

```bash
# Install the main package (recommended)
npm install lexkit

# Or install the core editor package
npm install @lexkit/editor

# Install required Lexical packages
npm install lexical @lexical/react @lexical/html @lexical/markdown @lexical/list @lexical/rich-text @lexical/selection @lexical/utils @lexical/code
```

## Your First Editor

Here's the minimal setup to get LexKit working:

```tsx
import React from 'react';
import { createEditorSystem, richTextExtension, boldExtension } from '@lexkit/editor';

// 1. Define extensions (as const is required for type safety)
const extensions = [richTextExtension, boldExtension] as const;

// 2. Create the editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// 3. Your editor component
function MyEditor() {
  const { commands } = useEditor();

  return (
    <div>
      <button onClick={() => commands.toggleBold()}>
        Toggle Bold
      </button>

      <RichText
        placeholder="Type something..."
      />
    </div>
  );
}

// 4. Use it in your app
export default function App() {
  return (
    <Provider extensions={extensions}>
      <MyEditor />
    </Provider>
  );
}
```

## Adding More Features

Let's enhance our editor with more extensions:

```tsx
import {
  createEditorSystem,
  richTextExtension,
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  historyExtension
} from '@lexkit/editor';

const extensions = [
  richTextExtension,
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  historyExtension
] as const;

function EnhancedToolbar() {
  const { commands, activeStates, hasExtension } = useEditor();

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '8px' }}>
      {hasExtension('bold') && (
        <button
          onClick={() => commands.toggleBold()}
          style={{ fontWeight: activeStates.bold ? 'bold' : 'normal' }}
        >
          Bold
        </button>
      )}

      {hasExtension('italic') && (
        <button
          onClick={() => commands.toggleItalic()}
          style={{ fontStyle: activeStates.italic ? 'italic' : 'normal' }}
        >
          Italic
        </button>
      )}

      {hasExtension('list') && (
        <>
          <button onClick={() => commands.toggleUnorderedList()}>
            • List
          </button>
          <button onClick={() => commands.toggleOrderedList()}>
            1. List
          </button>
        </>
      )}

      {hasExtension('history') && (
        <>
          <button onClick={() => commands.undo()}>Undo</button>
          <button onClick={() => commands.redo()}>Redo</button>
        </>
      )}
    </div>
  );
}
```

## Configuration

Configure extensions for advanced features:

```tsx
// Configure image extension
imageExtension.configure({
  uploadHandler: async (file) => {
    // Your upload logic
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    return await response.json();
  },
  defaultAlignment: 'center',
  resizable: true
});
```

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [Extensions Guide](./extensions.md) - Available extensions and how to use them
- [Styling Guide](./styling.md) - Customize the editor appearance
- [Examples](../../examples) - More complete examples
