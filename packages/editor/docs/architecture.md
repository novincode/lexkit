# LexKit Editor Architecture

## Overview

LexKit is a headless, extensible rich text editor built on top of Lexical. It provides a type-safe, plugin-based architecture for building modern editing experiences.

## Core Concepts

### Extensions

Extensions are the fundamental building blocks of LexKit. Each extension provides specific functionality:

- **Commands**: Actions that modify the editor state
- **State Queries**: Functions to check current editor state
- **Nodes**: Custom Lexical nodes for content types
- **Plugins**: React components for additional UI

### Editor System

The `createEditorSystem` function creates a typed editor context based on the extensions array:

```tsx
const extensions = [boldExtension, italicExtension] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();
```

This provides:
- Strongly typed commands and state
- Automatic plugin aggregation
- Extension lifecycle management

### Type System

LexKit uses advanced TypeScript features for type safety:

- **ExtractCommands**: Merges commands from all extensions
- **ExtractStateQueries**: Merges state queries from all extensions
- **Literal Types**: Extension names are literal types for better IntelliSense

## Extension Lifecycle

1. **Registration**: Extensions register with the Lexical editor
2. **Command Aggregation**: Commands are collected and made available
3. **State Tracking**: State queries are executed on editor updates
4. **Plugin Rendering**: React plugins are rendered in the editor

## Key Components

### BaseExtension

Abstract base class providing common functionality:

```tsx
abstract class BaseExtension<Name, Config, Commands, StateQueries, Plugins> {
  name: Name;
  config: Config;
  category: ExtensionCategory[];

  abstract register(editor: LexicalEditor): () => void;
  getCommands(editor: LexicalEditor): Commands;
  getStateQueries(editor: LexicalEditor): StateQueries;
  getPlugins(): Plugins;
}
```

### TextFormatExtension

Specialized extension for text formatting:

```tsx
abstract class TextFormatExtension<Name extends TextFormatType>
  extends BaseExtension<Name, any, TextFormatCommands<Name>, ...> {
  // Provides toggle commands and state queries for text formats
}
```

## Usage Patterns

### Basic Setup

```tsx
import { createEditorSystem } from '@repo/editor';
import { boldExtension, italicExtension } from '@repo/editor/extensions';

const extensions = [boldExtension, italicExtension] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

function Editor() {
  return (
    <Provider extensions={extensions}>
      <Toolbar />
      <EditorContent />
    </Provider>
  );
}
```

### Custom Extensions

```tsx
import { BaseExtension } from '@repo/editor/extensions/base';

class MyExtension extends BaseExtension<'myExtension'> {
  getCommands(editor) {
    return {
      insertMyBlock: () => { /* implementation */ }
    };
  }

  getStateQueries(editor) {
    return {
      hasMyBlock: () => Promise.resolve(false)
    };
  }
}
```

## State Management

State queries are async functions that check editor state:

```tsx
getStateQueries(editor: LexicalEditor) {
  return {
    bold: () => new Promise(resolve => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        resolve($isRangeSelection(selection) && selection.hasFormat('bold'));
      });
    })
  };
}
```

## Plugin System

Extensions can provide React plugins:

```tsx
getPlugins(): ReactNode[] {
  return [<MyPlugin key="my-plugin" />];
}
```

## Configuration

Extensions can be configured:

```tsx
const configuredExtension = imageExtension.configure({
  uploadHandler: async (file) => { /* upload logic */ },
  defaultAlignment: 'center'
});
```

## Best Practices

1. **Type Safety**: Always use `as const` for extension arrays
2. **Error Handling**: Wrap editor operations in try-catch blocks
3. **Performance**: Memoize expensive state queries
4. **Accessibility**: Provide proper ARIA labels and keyboard navigation

## Future Enhancements

- Dynamic extension loading
- Collaborative editing
- Advanced theming
- Plugin marketplace
