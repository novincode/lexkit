# LexKit - Free Open Source Rich Text Editor

<div align="center">

**Modern, React-Friendly Rich Text Editor Built on Lexical Framework**  
*Free • Open Source • Type-Safe • Scalable • Production-Ready*

[![npm version](https://badge.fury.io/js/lexkit)](https://github.com/novincode/lexkit)
[![npm version](https://badge.fury.io/js/%40lexkit%2Feditor.svg)](https://github.com/novincode/lexkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[📚 Documentation](https://github.com/novincode/lexkit/tree/main/packages/editor/docs) • [🚀 Demo](https://lexkit.dev/demo) • [⚡ Playground](https://stackblitz.com/edit/vitejs-vite-bpg2kpze) • [💬 Discord](https://discord.gg/hAvRFC9Y)

</div>

---

## 🚀 What is LexKit?

**LexKit** is a free, open-source, modern rich text editor framework built specifically for React developers. It provides a headless, extensible architecture on top of the powerful Lexical framework, giving you complete control over your editor's appearance and behavior while maintaining excellent developer experience.

### 🎯 Perfect For:
- **React Applications** - Seamless integration with React projects
- **Content Management Systems** - Build custom CMS solutions
- **Blog Platforms** - Create rich blogging experiences
- **Documentation Tools** - Technical writing and documentation
- **Email Editors** - Rich email composition
- **Note-taking Apps** - Enhanced note-taking functionality
- **WYSIWYG Editors** - Modern WYSIWYG experiences

### ✨ Key Features:
- 🔧 **Headless Architecture** - Complete UI control
- 🎨 **Fully Customizable** - Style it your way
- 📦 **Extension System** - Modular functionality
- 🎯 **Type-Safe** - Full TypeScript support
- 🚀 **Performance Optimized** - Built on Lexical
- 📱 **Mobile Friendly** - Responsive design
- 🎪 **Drag & Drop** - Intuitive content manipulation
- 🔌 **Plugin System** - Easy extensibility

LexKit is not just another rich text editor—it's a **type-safe, scalable framework** built on top of Lexical that gives you complete control while maintaining developer experience. Here's what sets it apart:

### 🎯 **Type-Safe Commands & State**
Commands and state queries are **automatically typed** based on your extensions:

```tsx
const extensions = [boldExtension, italicExtension, imageExtension] as const; // 👈 "as const" is required for type inference
const { useEditor } = createEditorSystem<typeof extensions>();

function MyEditor() {
  const { commands, activeStates } = useEditor();

  // ✅ TypeScript knows these exist and their signatures
  commands.toggleBold();        // ✅ Available
  commands.insertImage({});     // ✅ Available with proper types
  commands.nonExistent();       // ❌ TypeScript error

  // ✅ State queries are also typed
  if (activeStates.bold) { /* ... */ }      // ✅ Available
  if (activeStates.imageSelected) { /* ... */ } // ✅ Available
}
```

**Why `as const`?** It's required for TypeScript to infer literal types from your extensions array, enabling the powerful type safety features.

### 🧩 **Truly Headless & Composable**
- **Zero UI components** - Build your own interface
- **Plug-and-play extensions** - Mix and match functionality
- **Custom nodes support** - Add any content type
- **Theme system** - Style it your way

### 🚀 **Production Features Out-of-the-Box**
- **HTML & Markdown export/import** with custom transformers
- **Image handling** with upload, paste, and alignment
- **Table support** with context menus, row/column manipulation, and GitHub Flavored Markdown
- **Command palette** with searchable commands and keyboard shortcuts
- **Context menus** and floating toolbars for contextual actions
- **Undo/Redo** with full history
- **Multi-format editing** (Visual, HTML, Markdown modes)
- **Error boundaries** and robust error handling

---

## 📦 Installation

```bash
# Main package (recommended for most users)
npm install lexkit

# Or install the core editor package directly
npm install @lexkit/editor

# Also install required Lexical packages
npm install lexical @lexical/react @lexical/html @lexical/markdown @lexical/list @lexical/rich-text @lexical/selection @lexical/utils @lexical/code
```

---

## 🚀 Quick Start

Here's a **complete, working example** that showcases LexKit's power:

```tsx
import React, { useState } from 'react';
import {
  createEditorSystem,
  richTextExtension,
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
} from '@lexkit/editor';

// 1. Define your extensions (as const for type safety)
const extensions = [
  richTextExtension,    // 👈 Rich text editor with built-in error handling
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
] as const;

// 2. Create your editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// 3. Create a simple toolbar
function Toolbar() {
  const { commands, activeStates, hasExtension } = useEditor();

  return (
    <div style={{ padding: '8px', borderBottom: '1px solid #ccc', display: 'flex', gap: '4px' }}>
      <button
        onClick={() => commands.toggleBold()}
        style={{
          fontWeight: activeStates.bold ? 'bold' : 'normal',
          padding: '4px 8px',
          border: '1px solid #ccc',
          background: activeStates.bold ? '#e0e0e0' : 'white'
        }}
      >
        B
      </button>

      <button
        onClick={() => commands.toggleItalic()}
        style={{
          fontStyle: activeStates.italic ? 'italic' : 'normal',
          padding: '4px 8px',
          border: '1px solid #ccc',
          background: activeStates.italic ? '#e0e0e0' : 'white'
        }}
      >
        I
      </button>

      <button
        onClick={() => commands.toggleUnderline()}
        style={{
          textDecoration: activeStates.underline ? 'underline' : 'none',
          padding: '4px 8px',
          border: '1px solid #ccc',
          background: activeStates.underline ? '#e0e0e0' : 'white'
        }}
      >
        U
      </button>

      <button
        onClick={() => commands.toggleUnorderedList()}
        style={{
          padding: '4px 8px',
          border: '1px solid #ccc',
          background: activeStates.unorderedList ? '#e0e0e0' : 'white'
        }}
      >
        • List
      </button>

      <button
        onClick={() => commands.toggleOrderedList()}
        style={{
          padding: '4px 8px',
          border: '1px solid #ccc',
          background: activeStates.orderedList ? '#e0e0e0' : 'white'
        }}
      >
        1. List
      </button>

      {hasExtension('image') && (
        <button
          onClick={() => {
            const src = prompt('Enter image URL:');
            if (src) commands.insertImage({ src, alt: 'Image' });
          }}
          style={{ padding: '4px 8px', border: '1px solid #ccc' }}
        >
          📷 Image
        </button>
      )}

      {hasExtension('history') && (
        <>
          <button
            onClick={() => commands.undo()}
            disabled={!activeStates.canUndo}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              background: activeStates.canUndo ? 'white' : '#f5f5f5',
              color: activeStates.canUndo ? 'black' : '#999'
            }}
          >
            ↶ Undo
          </button>
          <button
            onClick={() => commands.redo()}
            disabled={!activeStates.canRedo}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              background: activeStates.canRedo ? 'white' : '#f5f5f5',
              color: activeStates.canRedo ? 'black' : '#999'
            }}
          >
            ↷ Redo
          </button>
        </>
      )}
    </div>
  );
}

// 4. Create your editor component
function Editor() {
  const { commands, hasExtension } = useEditor();
  const [mode, setMode] = useState<'visual' | 'html' | 'markdown'>('visual');
  const [content, setContent] = useState('');

  const handleModeChange = (newMode: typeof mode) => {
    if (newMode === 'html' && hasExtension('html')) {
      setContent(commands.exportToHTML());
    } else if (newMode === 'markdown' && hasExtension('markdown')) {
      setContent(commands.exportToMarkdown());
    }
    setMode(newMode);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (mode === 'html' && hasExtension('html')) {
      commands.importFromHTML(value);
    } else if (mode === 'markdown' && hasExtension('markdown')) {
      commands.importFromMarkdown(value);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      {/* Mode Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => handleModeChange('visual')}
          style={{
            padding: '8px 16px',
            background: mode === 'visual' ? '#f0f0f0' : 'white',
            border: 'none',
            borderRight: '1px solid #ccc'
          }}
        >
          Visual
        </button>
        <button
          onClick={() => handleModeChange('html')}
          style={{
            padding: '8px 16px',
            background: mode === 'html' ? '#f0f0f0' : 'white',
            border: 'none',
            borderRight: '1px solid #ccc'
          }}
        >
          HTML
        </button>
        <button
          onClick={() => handleModeChange('markdown')}
          style={{
            padding: '8px 16px',
            background: mode === 'markdown' ? '#f0f0f0' : 'white',
            border: 'none'
          }}
        >
          Markdown
        </button>
      </div>

      {/* Toolbar (only in visual mode) */}
      {mode === 'visual' && <Toolbar />}

      {/* Editor Content */}
      <div style={{ minHeight: '200px' }}>
        {mode === 'visual' ? (
          <RichText
            placeholder="Start writing..."
            className="editor-content"
            style={{
              padding: '16px',
              outline: 'none',
              minHeight: '200px'
            }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '16px',
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
            placeholder={`Enter ${mode.toUpperCase()} content...`}
          />
        )}
      </div>
    </div>
  );
}

// 5. Use it in your app
export default function App() {
  return (
    <Provider extensions={extensions}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>My LexKit Editor</h1>
        <Editor />
      </div>
    </Provider>
  );
}
```

**This example works out-of-the-box!** 🎉

### 🎯 **Key Changes in This Version**

- **Simplified Setup**: No more manual `RichTextPlugin`, `ContentEditable`, or `HistoryPlugin` setup
- **Built-in Error Handling**: The `richTextExtension` includes automatic error boundaries
- **Type-Safe**: All commands and state queries are fully typed
- **Flexible**: Use `RichText` as a standalone component or as part of the extension system
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
] as const; // 👈 Required for TypeScript to infer literal types

// 2. Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// 3. Configure extensions (optional)
imageExtension.configure({
  uploadHandler: async (file: File) => {
    // Your upload logic here
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await response.json();
    return url;
  },
  defaultAlignment: 'center',
  resizable: true,
  pasteListener: { insert: true, replace: true }, // Auto-insert pasted images
  debug: false
});

// 5. Create your toolbar component
function Toolbar() {
  const { commands, activeStates, hasExtension } = useEditor();

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '8px', borderBottom: '1px solid #ccc' }}>
      {hasExtension('bold') && (
        <button
          onClick={() => commands.toggleBold()}
          style={{
            fontWeight: activeStates.bold ? 'bold' : 'normal',
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: activeStates.bold ? '#e0e0e0' : 'white'
          }}
        >
          Bold
        </button>
      )}

      {hasExtension('italic') && (
        <button
          onClick={() => commands.toggleItalic()}
          style={{
            fontStyle: activeStates.italic ? 'italic' : 'normal',
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: activeStates.italic ? '#e0e0e0' : 'white'
          }}
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

      {hasExtension('image') && (
        <button onClick={() => {
          const src = prompt('Image URL:');
          if (src) commands.insertImage({ src, alt: 'Image' });
        }}>
          📷 Image
        </button>
      )}

      {hasExtension('history') && (
        <>
          <button
            onClick={() => commands.undo()}
            disabled={!activeStates.canUndo}
          >
            ↶ Undo
          </button>
          <button
            onClick={() => commands.redo()}
            disabled={!activeStates.canRedo}
          >
            ↷ Redo
          </button>
        </>
      )}
    </div>
  );
}

// 4. Create your editor component
function Editor() {
  const { commands, hasExtension } = useEditor();
  const [mode, setMode] = useState<'visual' | 'html' | 'markdown'>('visual');
  const [content, setContent] = useState('');

  const handleModeChange = (newMode: typeof mode) => {
    if (newMode === 'html' && hasExtension('html')) {
      setContent(commands.exportToHTML());
    } else if (newMode === 'markdown' && hasExtension('markdown')) {
      setContent(commands.exportToMarkdown());
    }
    setMode(newMode);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (mode === 'html' && hasExtension('html')) {
      commands.importFromHTML(value);
    } else if (mode === 'markdown' && hasExtension('markdown')) {
      commands.importFromMarkdown(value);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      {/* Mode Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => handleModeChange('visual')}
          style={{
            padding: '8px 16px',
            background: mode === 'visual' ? '#f0f0f0' : 'white',
            border: 'none',
            borderRight: '1px solid #ccc'
          }}
        >
          Visual
        </button>
        <button
          onClick={() => handleModeChange('html')}
          style={{
            padding: '8px 16px',
            background: mode === 'html' ? '#f0f0f0' : 'white',
            border: 'none',
            borderRight: '1px solid #ccc'
          }}
        >
          HTML
        </button>
        <button
          onClick={() => handleModeChange('markdown')}
          style={{
            padding: '8px 16px',
            background: mode === 'markdown' ? '#f0f0f0' : 'white',
            border: 'none'
          }}
        >
          Markdown
        </button>
      </div>

      {/* Toolbar (only in visual mode) */}
      {mode === 'visual' && <Toolbar />}

      {/* Editor Content */}
      <div style={{ minHeight: '200px' }}>
        {mode === 'visual' ? (
          <RichText
            placeholder="Start writing..."
            className="editor-content"
            style={{
              padding: '16px',
              outline: 'none',
              minHeight: '200px'
            }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '16px',
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
            placeholder={`Enter ${mode.toUpperCase()} content...`}
          />
        )}
      </div>
    </div>
  );
}

// 5. Use it in your app
export default function App() {
  return (
    <Provider extensions={extensions}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>My LexKit Editor</h1>
        <Editor />
      </div>
    </Provider>
  );
}
```

### 🎯 **Key Changes in This Version**

- **Simplified Setup**: No more manual `RichTextPlugin`, `ContentEditable`, or `HistoryPlugin` setup
- **Built-in Error Handling**: The `richTextExtension` includes automatic error boundaries
- **Type-Safe**: All commands and state queries are fully typed
- **Flexible**: Use `RichText` as a standalone component or as part of the extension system

### 📝 **Standalone RichText Component**

You can also use `RichText` as a standalone component without the extension system:

```tsx
import React from 'react';
import { RichText } from '@lexkit/editor';

function SimpleEditor() {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
      <RichText
        placeholder="Start writing..."
        className="my-editor"
        style={{
          padding: '16px',
          minHeight: '200px',
          outline: 'none'
        }}
        onChange={(editorState) => {
          // Handle content changes
          console.log('Content changed:', editorState);
        }}
      />
    </div>
  );
}
```

### � **Custom Styling & Theming**

LexKit supports custom classNames and styles:

```tsx
// With custom className
<RichText
  className="my-custom-editor"
  placeholder="Custom styled editor..."
/>

// With inline styles
<RichText
  style={{
    padding: '20px',
    border: '2px solid #007acc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif'
  }}
  placeholder="Styled editor..."
/>

// With theme integration
const theme = {
  richText: {
    container: 'editor-container',
    content: 'editor-content',
    placeholder: 'editor-placeholder'
  }
};

<RichText
  className={theme.richText.content}
  placeholderClassName={theme.richText.placeholder}
/>
```

### 📊 **Advanced Table Support**
LexKit now includes comprehensive table functionality:

```tsx
const extensions = [
  tableExtension,
  // ... other extensions
] as const;

function MyEditor() {
  const { commands, activeStates } = useEditor();

  return (
    <div>
      {/* Insert table */}
      <button onClick={() => commands.insertTable({ rows: 3, columns: 3 })}>
        Insert Table
      </button>

      {/* Table commands (when in table cell) */}
      {activeStates.isInTableCell && (
        <div>
          <button onClick={() => commands.table.insertRowAbove()}>
            Insert Row Above
          </button>
          <button onClick={() => commands.table.insertRowBelow()}>
            Insert Row Below
          </button>
          <button onClick={() => commands.table.insertColumnLeft()}>
            Insert Column Left
          </button>
          <button onClick={() => commands.table.insertColumnRight()}>
            Insert Column Right
          </button>
        </div>
      )}
    </div>
  );
}
```

**Features:**
- ✅ Right-click context menus on table cells
- ✅ Row and column manipulation commands
- ✅ GitHub Flavored Markdown table support
- ✅ Table selection and styling
- ✅ Keyboard shortcuts for table operations

### 🎯 **Command Palette**
Searchable command interface with keyboard shortcuts:

```tsx
const extensions = [
  commandPaletteExtension,
  // ... other extensions
] as const;

function MyEditor() {
  const { commands } = useEditor();

  return (
    <div>
      {/* Command palette button */}
      <button onClick={() => commands.showCommandPalette()}>
        ⌘ Search Commands
      </button>
    </div>
  );
}
```

**Features:**
- ✅ Search all available commands
- ✅ Keyboard shortcuts (Ctrl+K / Cmd+K)
- ✅ Categorized command groups
- ✅ Custom command registration

### 📋 **Context Menus & Floating Toolbars**
Headless contextual UI components:

```tsx
const extensions = [
  contextMenuExtension,
  floatingToolbarExtension,
  // ... other extensions
] as const;

function MyEditor() {
  const { commands } = useEditor();

  const showContextMenu = () => {
    commands.showContextMenu({
      items: [
        { label: 'Copy', action: () => console.log('Copy') },
        { label: 'Paste', action: () => console.log('Paste') },
        { separator: true },
        { label: 'Delete', action: () => console.log('Delete') }
      ],
      position: { x: 100, y: 100 }
    });
  };

  return (
    <button onClick={showContextMenu}>
      Show Context Menu
    </button>
  );
}
```

---

## 📦 Packages

LexKit is organized as a monorepo with the following packages:

### Core Packages
- **`lexkit`** - Main package (recommended for most users)
  - Re-exports everything from `@lexkit/editor`
  - Includes common extensions and utilities
  - Simple API for quick setup

- **`@lexkit/editor`** - Core editor package
  - Type-safe editor system
  - 25+ extensions available
  - Headless architecture
  - Full customization control

### UI Packages (Coming Soon)
- **`@lexkit/ui`** - Pre-built UI components
  - Toolbar components
  - Modal dialogs
  - Theme system
  - Accessibility features

### Development Packages
- **`@repo/eslint-config`** - Shared ESLint configuration
- **`@repo/typescript-config`** - Shared TypeScript configuration
- **`@repo/ui`** - Shared UI components

---

## 📋 Extensions & Commands Reference

LexKit provides **25+ extensions** with typed commands and state queries:

### Text Formatting
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `boldExtension` | `toggleBold()` | `bold: boolean` |
| `italicExtension` | `toggleItalic()` | `italic: boolean` |
| `underlineExtension` | `toggleUnderline()` | `underline: boolean` |
| `strikethroughExtension` | `toggleStrikethrough()` | `strikethrough: boolean` |
| `codeExtension` | `formatText('code')` | `code: boolean` |
| `linkExtension` | `insertLink()`, `removeLink()` | `isLink: boolean` |

### Structure & Blocks
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `listExtension` | `toggleUnorderedList()`, `toggleOrderedList()` | `unorderedList`, `orderedList` |
| `blockFormatExtension` | `toggleHeading('h1'-'h6')`, `toggleQuote()` | `isH1`, `isH2`, ..., `isQuote` |
| `codeFormatExtension` | `toggleCodeBlock()` | `isInCodeBlock` |
| `horizontalRuleExtension` | `insertHorizontalRule()` | - |

### Tables
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `tableExtension` | `insertTable()`, `table.*` (row/column operations) | `isTableSelected`, `isInTableCell` |

### Media & Embeds
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `imageExtension` | `insertImage({...})`, `setImageAlignment()`, `setImageCaption()` | `imageSelected` |
| `htmlEmbedExtension` | `insertHTMLEmbed()`, `toggleHTMLPreview()` | `isHTMLEmbedSelected`, `isHTMLPreviewMode` |

### Core System
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `commandPaletteExtension` | `showCommandPalette()`, `registerCommand()` | `isCommandPaletteOpen` |
| `contextMenuExtension` | `showContextMenu()`, `hideContextMenu()` | `isContextMenuOpen` |
| `floatingToolbarExtension` | `showFloatingToolbar()`, `hideFloatingToolbar()` | `isFloatingToolbarOpen` |

### History & Utils
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `historyExtension` | `undo()`, `redo()` | `canUndo`, `canRedo` |

### Export/Import
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `htmlExtension` | `exportToHTML()`, `importFromHTML()` | - |
| `markdownExtension` | `exportToMarkdown()`, `importFromMarkdown()` | - |

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/novincode/lexkit.git
cd lexkit

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Lint
pnpm lint
```

### Project Structure
```
lexkit/
├── packages/
│   ├── editor/          # Core editor package
│   ├── ui/             # UI components
│   ├── eslint-config/  # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
├── apps/
│   └── web/            # Next.js demo app
└── docs/               # Documentation
```

### Adding Components

To add shadcn/ui components to the web app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the UI components in the `packages/ui/src/components` directory.

### Tailwind CSS

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

```tsx
import { Button } from "@repo/ui/components/button"
```

---

## 📚 Documentation

### 📖 API Reference
- **[Core API](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/api-reference.md)** - Complete API documentation
- **[Architecture](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/architecture.md)** - System design and concepts

### 🚀 Getting Started
- **[Quick Start Guide](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/getting-started.md)** - Step-by-step setup guide
- **[Extension Guide](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/extensions.md)** - Using and creating extensions

### 🎨 Customization
- **[Styling Guide](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/styling.md)** - Complete styling and theming guide
- **[Performance Guide](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/performance.md)** - Optimization and performance tips

### 🔧 Troubleshooting
- **[Troubleshooting Guide](https://github.com/novincode/main/packages/editor/docs/troubleshooting.md)** - Common issues and solutions

### 🚀 Examples & Tutorials
- **[Quick Start Examples](https://github.com/novincode/lexkit/tree/main/examples)** - Code examples
- **[Interactive Demo](https://lexkit.dev/demo)** - Live playground
- **[StackBlitz Playground](https://stackblitz.com/edit/vitejs-vite-bpg2kpze)** - Experiment online

### 📝 Development
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Improvement Notes](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/improvement_NOTES.md)** - Planned enhancements

---

## 🎨 Advanced Configuration

### Image Extension Setup

The image extension is incredibly powerful and handles uploads, paste, and alignment:

```tsx
import { imageExtension } from '@lexkit/editor';

// Configure once (before using Provider)
imageExtension.configure({
  // Required: Handle file uploads
  uploadHandler: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const { url } = await response.json();
    return url; // Return the image URL
  },

  // Optional: Default alignment for new images
  defaultAlignment: 'center', // 'left' | 'center' | 'right' | 'none'

  // Optional: Allow image resizing
  resizable: true,

  // Optional: Auto-insert images from clipboard
  pasteListener: {
    insert: true,    // Insert pasted images
    replace: true    // Replace selected images on paste
  },

  // Optional: Debug mode
  debug: false
});
```

### Custom Nodes & Extensions

Create your own content types with full Lexical integration:

```tsx
import { BaseExtension } from '@lexkit/editor/extensions/base';
import { $createCustomNode, CustomNode } from './CustomNode';

class MyCustomExtension extends BaseExtension<'myCustom'> {
  constructor() {
    super('myCustom');
  }

  getCommands(editor) {
    return {
      insertMyBlock: (data: { text: string; color: string }) => {
        editor.update(() => {
          const node = $createCustomNode(data);
          $getRoot().append(node);
        });
      }
    };
  }

  getStateQueries(editor) {
    return {
      hasMyBlock: async () => {
        return new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const root = $getRoot();
            const hasCustom = root.getChildren().some(
              child => child instanceof CustomNode
            );
            resolve(hasCustom);
          });
        });
      }
    };
  }

  getNodes() {
    return [CustomNode];
  }
}

const myExtension = new MyCustomExtension();

// Use it in your extensions array
const extensions = [boldExtension, myExtension] as const;
```

### Theming

LexKit supports custom themes:

```tsx
const customTheme = {
  text: {
    bold: 'font-bold text-blue-600',
    italic: 'italic text-green-600',
    underline: 'underline decoration-red-500',
    strikethrough: 'line-through text-gray-500'
  },
  block: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-semibold mb-3',
    quote: 'border-l-4 border-gray-300 pl-4 italic'
  }
};

<Provider extensions={extensions} config={{ theme: customTheme }}>
  <YourEditor />
</Provider>
```

---

## 🔧 Built on Lexical

LexKit is built on top of [Lexical](https://lexical.dev/), the powerful editor framework by Meta. This gives you:

- **Performance**: Virtual DOM-based rendering
- **Accessibility**: Full keyboard navigation and screen reader support
- **Extensibility**: Plugin architecture for custom functionality
- **Serialization**: JSON-based document model
- **Collaboration**: Real-time editing support (via Lexical)

---

## 🌟 Why Choose LexKit?

### ✅ **Type Safety First**
- Commands and states are **automatically typed** based on your extensions
- No more runtime errors from typos in command names
- Full IntelliSense support in your IDE

### ✅ **Scalable Architecture**
- **Headless by design** - Build any UI you want
- **Composable extensions** - Add only what you need
- **Custom nodes** - Support any content type
- **Plugin system** - Extend functionality infinitely

### ✅ **Production Ready**
- **Error boundaries** and robust error handling
- **Multi-format support** (HTML, Markdown, JSON)
- **Image handling** with upload and paste support
- **Undo/Redo** with full history
- **Theme system** for consistent styling

### ✅ **Developer Experience**
- **Zero-config setup** for basic usage
- **Tree-shakeable** - Only bundle what you use
- **TypeScript first** - Full type safety
- **Comprehensive docs** and examples

---

## 📚 Documentation & Examples

- **[📖 Getting Started](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/getting-started.md)** - Quick setup guide
- **[🎨 Styling Guide](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/styling.md)** - Complete theming guide
- **[🚀 Performance Guide](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/performance.md)** - Optimization tips
- **[🔧 Troubleshooting](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/troubleshooting.md)** - Common issues & solutions
- **[📚 API Reference](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/api-reference.md)** - Complete API docs
- **[🚀 Interactive Demo](https://lexkit.dev/demo)** - Try it live
- **[⚡ Live Playground](https://stackblitz.com/edit/vitejs-vite-bpg2kpze)** - Experiment with LexKit
- **[💬 Discord Community](https://discord.gg/hAvRFC9Y)** - Get help and share ideas

*📝 **Coming Soon**: Comprehensive documentation website with playground, tutorials, and advanced examples*

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) and [Development Notes](https://github.com/novincode/lexkit/blob/main/packages/editor/docs/improvement_NOTES.md).

---

## 📄 License

MIT © [LexKit Team](https://github.com/novincode/lexkit)

---

<div align="center">

**Made with ❤️ by the LexKit team**

[⭐ Star us on GitHub](https://github.com/novincode/lexkit) • [🐛 Report Issues](https://github.com/novincode/lexkit/issues) • [💝 Sponsor](https://github.com/sponsors/lexkit)

</div>