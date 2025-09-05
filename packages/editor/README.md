# LexKit Editor

A headless, extensible rich text editor built on top of Lexical, designed for modern React applications.

## Overview

LexKit is a powerful editor framework that provides a clean, type-safe API for building rich text editors. It uses Lexical under the hood but abstracts away the complexity, allowing you to focus on building great editing experiences.

## Key Features

- **Headless Architecture**: No UI components included - build your own interface
- **Type-Safe Extensions**: Strongly typed commands and state queries
- **Plugin System**: Modular extensions for different features
- **Multi-Format Support**: HTML, Markdown, and JSON export/import
- **Theme Support**: Customizable theming system
- **React Integration**: Seamless integration with React applications

## Quick Start

```tsx
import { createEditorSystem } from '@repo/editor';
import { boldExtension, italicExtension } from '@repo/editor/extensions';

const extensions = [boldExtension, italicExtension] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

function MyEditor() {
  return (
    <Provider extensions={extensions}>
      <EditorContent />
    </Provider>
  );
}

function EditorContent() {
  const { commands, activeStates } = useEditor();

  return (
    <div>
      <button onClick={() => commands.toggleBold()}>
        Bold {activeStates.bold ? '✓' : ''}
      </button>
      <div contentEditable />
    </div>
  );
}
```

## Architecture

### Core Components

- **createEditorSystem**: Factory function that creates a typed editor context
- **Extensions**: Modular plugins that add functionality
- **Commands**: Actions that modify the editor state
- **State Queries**: Functions to check current editor state

### Extension System

Extensions are the building blocks of LexKit. Each extension provides:

- Commands: Actions like `toggleBold`, `insertImage`
- State Queries: Checks like `isBold`, `canUndo`
- Nodes: Custom Lexical nodes
- Plugins: React components for additional functionality

## Available Extensions

### Formatting
- `boldExtension`: Bold text formatting
- `italicExtension`: Italic text formatting
- `underlineExtension`: Underline text formatting
- `strikethroughExtension`: Strikethrough text formatting
- `codeExtension`: Inline code formatting

### Structure
- `blockFormatExtension`: Headings, paragraphs, quotes
- `listExtension`: Bulleted and numbered lists

### Media
- `imageExtension`: Image insertion and management
- `htmlEmbedExtension`: HTML embed support

### Export/Import
- `htmlExtension`: HTML export/import
- `markdownExtension`: Markdown export/import

### Utilities
- `historyExtension`: Undo/redo functionality

## Advanced Usage

### Custom Extensions

```tsx
import { BaseExtension } from '@repo/editor/extensions/base';

class MyExtension extends BaseExtension<'myExtension'> {
  constructor() {
    super('myExtension');
  }

  getCommands(editor) {
    return {
      insertMyBlock: (data) => {
        // Implementation
      }
    };
  }

  getStateQueries(editor) {
    return {
      hasMyBlock: () => Promise.resolve(false)
    };
  }
}
```

### Configuration

```tsx
// Configure extensions
const configuredImageExtension = imageExtension.configure({
  uploadHandler: async (file) => {
    // Custom upload logic
    return uploadedUrl;
  },
  defaultAlignment: 'center'
});
```

### Theming

```tsx
const { Provider } = createEditorSystem();

<Provider
  extensions={extensions}
  config={{
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'font-italic'
      }
    }
  }}
>
  {/* Your editor */}
</Provider>
```

## API Reference

### createEditorSystem

```tsx
function createEditorSystem<Extensions>() => {
  Provider: React.Component
  useEditor: () => EditorContext
}
```

### useEditor Hook

```tsx
const {
  commands,        // Available commands
  activeStates,    // Current state
  hasExtension,    // Check if extension is loaded
  lexical         // Raw Lexical editor instance
} = useEditor();
```

## Contributing

See the [improvement notes](./docs/improvement_NOTES.md) for planned enhancements and development guidelines.

## License

MIT