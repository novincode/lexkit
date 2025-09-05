# LexKit

A headless, extensible rich text editor built on [Lexical](https://lexical.dev).

## Installation

```bash
# Main package (recommended)
npm install lexkit

# Or scoped package
npm install @lexkit/editor
```

## Quick Start

```tsx
import { createEditorSystem, boldExtension } from 'lexkit';

const extensions = [boldExtension];
const editor = createEditorSystem(extensions);

// Use in your React component
function MyEditor() {
  const { editor, commands } = useEditor();

  return (
    <div>
      <button onClick={() => commands.toggleBold()}>
        Bold
      </button>
      {/* Your editor content */}
    </div>
  );
}
```

## Features

- 🚀 **Headless**: Full control over UI and styling
- 🔧 **Extensible**: Plugin system for custom functionality
- 📝 **Type-safe**: Full TypeScript support
- ⚡ **Performance**: Built on Lexical for optimal performance
- 🎨 **Flexible**: Support for custom themes and components

## Documentation

- [API Reference](./docs/api-reference.md)
- [Architecture](./docs/architecture.md)
- [Extensions](./docs/extensions.md)

## License

MIT
