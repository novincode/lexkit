# LexKit

A headless, extensible rich text editor built on [Lexical](https://lexical.dev).

## Packages

- **`lexkit`** - Main package (recommended for most users)
- **`@lexkit/editor`** - Core editor package
- **`@lexkit/ui`** - UI components (coming soon)

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

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Lint
pnpm lint
```

## Documentation

- [API Reference](./packages/editor/docs/api-reference.md)
- [Architecture](./packages/editor/docs/architecture.md)

## License

MIT

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@repo/ui/components/button"
```
