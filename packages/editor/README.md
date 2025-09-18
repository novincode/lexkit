# LexKit

**Type-safe rich text editor for React developers**

Built on Meta's Lexical. Headless, extensible, and production-ready.

[![npm version](https://badge.fury.io/js/%40lexkit%2Feditor.svg)](https://badge.fury.io/js/%40lexkit%2Feditor)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**[🚀 Demo](https://lexkit.dev/demo)** • **[📖 Documentation](https://lexkit.dev/docs)** • **[⚡ Playground](https://stackblitz.com/edit/vitejs-vite-bpg2kpze?file=src%2FEditor.tsx)**

![LexKit Editor](https://github.com/user-attachments/assets/ec547406-0ab0-4e69-b9d7-ccd050adf78a)

---

## Why LexKit?

Rich text editors shouldn't be a nightmare. LexKit makes building them delightful:

- **🔒 Type-safe everything** - Commands and states inferred from your extensions. No runtime surprises.
- **🎨 Headless & flexible** - Build any UI you want. Style it your way.
- **🧩 Modular extensions** - Add only what you need, when you need it.
- **⚡ Production features** - HTML/Markdown export, image handling, tables, undo/redo.
- **⚛️ React-first** - Hooks, components, and patterns you already know.

```tsx
// Your extensions define your API - TypeScript knows everything ✨
const extensions = [boldExtension, listExtension, imageExtension] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

function MyEditor() {
  const { commands, activeStates } = useEditor();

  // TypeScript autocompletes and validates these
  commands.toggleBold();        // ✅ Available
  commands.toggleUnorderedList(); // ✅ Available
  commands.insertImage();       // ✅ Available
  commands.nonExistent();       // ❌ TypeScript error
}
```

## Quick Start

```bash
npm install @lexkit/editor
```

Install the Lexical peer dependencies:

```bash
npm install lexical @lexical/react @lexical/html @lexical/markdown @lexical/list @lexical/rich-text @lexical/selection @lexical/utils
```

```tsx
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  listExtension,
  RichText,
} from "@lexkit/editor";

const extensions = [boldExtension, italicExtension, listExtension] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

function Toolbar() {
  const { commands, activeStates } = useEditor();
  return (
    <div className="toolbar">
      <button
        onClick={() => commands.toggleBold()}
        className={activeStates.bold ? "active" : ""}
      >
        Bold
      </button>
      <button
        onClick={() => commands.toggleItalic()}
        className={activeStates.italic ? "active" : ""}
      >
        Italic
      </button>
      <button onClick={() => commands.toggleUnorderedList()}>
        Bullet List
      </button>
    </div>
  );
}

function Editor() {
  return (
    <div className="editor-container">
      <Toolbar />
      <RichText placeholder="Start writing..." />
    </div>
  );
}

export default function App() {
  return (
    <Provider extensions={extensions}>
      <Editor />
    </Provider>
  );
}
```

**That's it.** You now have a fully functional, type-safe rich text editor.

## Features

### 🎨 Built-in Extensions (25+)
- **Text Formatting**: Bold, italic, underline, strikethrough, inline code
- **Structure**: Headings, lists (with nesting), quotes, horizontal rules
- **Rich Content**: Tables, images (upload/paste/alignment), links, code blocks
- **Advanced**: History (undo/redo), command palette, floating toolbar, context menus

### 🎯 Smart List Handling
- Toggle lists with intelligent nesting behavior
- Context-aware toolbar (indent/outdent appear when needed)
- Nested lists without keyboard shortcuts
- Clean UX that matches modern editors

### 📤 Export & Import
- **HTML** with semantic markup
- **Markdown** with GitHub Flavored syntax
- **JSON** for structured data
- Custom transformers for specialized formats

### 🎨 Theming & Styling
- CSS classes or Tailwind utilities
- Custom themes for consistent styling
- Dark mode support
- Accessible by default

## Real World Usage

LexKit powers editors in:
- Content management systems
- Documentation platforms
- Blog editors
- Note-taking applications
- Comment systems
- Collaborative writing tools

## Community & Support

- **[💬 Discord](https://discord.gg/SAqTGDkR)** - Get help, share ideas
- **[🐛 GitHub Issues](https://github.com/novincode/lexkit/issues)** - Bug reports, feature requests
- **[💭 Discussions](https://github.com/novincode/lexkit/discussions)** - Questions, showcase your projects

## Contributing

We welcome contributions! Whether you:
- Find and report bugs
- Suggest new features
- Contribute code or documentation
- Share projects built with LexKit
- Star the repo to show support

Check our [Contributing Guide](./CONTRIBUTING.md) to get started.

## Support This Project

LexKit is free and open source, built by developers for developers. If it's helping you build better editors, consider supporting its development:

- **⭐ Star this repository** to show your support
- **💝 [Sponsor the project](https://github.com/sponsors/novincode)** to help with maintenance and new features
- **📢 Share LexKit** with other developers

Your support keeps this project alive and helps us build better tools for the React community.

---

**Built with ❤️ by [novincode](https://github.com/novincode)**

MIT License - Use it however you want.</content>