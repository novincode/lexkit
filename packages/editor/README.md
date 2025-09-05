# LexKit Editor

<div align="center">

**A headless, extensible rich text editor built on Lexical**  
*Type-safe • Scalable • Production-ready*

[![npm version](https://badge.fury.io/js/%40lexkit%2Feditor.svg)](https://badge.fury.io/js/%40lexkit%2Feditor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[📚 Documentation](https://lexkit.codeideal.com) • [🚀 Demo](https://lexkit.codeideal.com/demo) • [� Playground](https://stackblitz.com/edit/vitejs-vite-bpg2kpze) • [�💬 Discord](https://discord.gg/hAvRFC9Y)

</div>

---

## ✨ What Makes LexKit Special

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
- **Undo/Redo** with full history
- **Multi-format editing** (Visual, HTML, Markdown modes)
- **Error boundaries** and robust error handling

---

## 📦 Installation

```bash
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
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  imageExtension,
  htmlExtension,
  markdownExtension,
  historyExtension
} from '@lexkit/editor';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

// 1. Define your extensions (as const for type safety)
const extensions = [
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

// 3. Error Boundary (required by Lexical)
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Editor Error:', error);
    return (
      <div style={{
        color: 'red',
        border: '1px solid red',
        padding: '20px',
        backgroundColor: '#ffe6e6',
        borderRadius: '4px',
        margin: '10px 0'
      }}>
        <h3>Editor Error</h3>
        <p>Something went wrong. Please refresh the page.</p>
      </div>
    );
  }
};

// 4. Configure extensions (optional)
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

// 6. Create your editor component
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
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  padding: '16px',
                  outline: 'none',
                  minHeight: '200px'
                }}
              />
            }
            placeholder={
              <div style={{ color: '#999', padding: '16px' }}>
                Start writing...
              </div>
            }
            ErrorBoundary={ErrorBoundary}
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

      <HistoryPlugin />
    </div>
  );
}

// 7. Use it in your app
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

### Structure & Blocks
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `listExtension` | `toggleUnorderedList()`, `toggleOrderedList()` | `unorderedList`, `orderedList` |
| `blockFormatExtension` | `toggleHeading('h1'-'h6')`, `toggleQuote()` | `isH1`, `isH2`, ..., `isQuote` |
| `codeFormatExtension` | `toggleCodeBlock()` | `isInCodeBlock` |

### Media & Embeds
| Extension | Commands | State Queries |
|-----------|----------|---------------|
| `imageExtension` | `insertImage({...})`, `setImageAlignment()`, `setImageCaption()` | `imageSelected` |
| `htmlEmbedExtension` | `insertHTMLEmbed()`, `toggleHTMLPreview()` | `isHTMLEmbedSelected`, `isHTMLPreviewMode` |

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

### Multi-Format Editing

LexKit supports seamless switching between Visual, HTML, and Markdown editing modes:

```tsx
function MultiFormatEditor() {
  const { commands, hasExtension } = useEditor();
  const [mode, setMode] = useState<'visual' | 'html' | 'markdown'>('visual');
  const [content, setContent] = useState('');

  const switchMode = (newMode: typeof mode) => {
    // Export current content before switching
    if (mode === 'visual' && newMode === 'html' && hasExtension('html')) {
      setContent(commands.exportToHTML());
    } else if (mode === 'visual' && newMode === 'markdown' && hasExtension('markdown')) {
      setContent(commands.exportToMarkdown());
    }
    setMode(newMode);
  };

  const updateContent = (value: string) => {
    setContent(value);
    // Import content back to editor
    if (mode === 'html' && hasExtension('html')) {
      commands.importFromHTML(value);
    } else if (mode === 'markdown' && hasExtension('markdown')) {
      commands.importFromMarkdown(value);
    }
  };

  return (
    <div>
      {/* Mode Switcher */}
      <div>
        <button onClick={() => switchMode('visual')}>Visual</button>
        <button onClick={() => switchMode('html')}>HTML</button>
        <button onClick={() => switchMode('markdown')}>Markdown</button>
      </div>

      {/* Content Area */}
      {mode === 'visual' ? (
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Start writing...</div>}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder={`Enter ${mode.toUpperCase()}...`}
        />
      )}
    </div>
  );
}
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

### 🎨 Styling Your Editor

LexKit is **headless by design** - you control all the styling! Here are your options:

#### Option 1: CSS Classes (Recommended)
Use the default theme structure and style with CSS:

```tsx
// In your theme configuration
const theme = {
  toolbar: 'my-toolbar',
  editor: 'my-editor',
  contentEditable: 'my-content',
  paragraph: 'my-paragraph',
  heading: {
    h1: 'my-h1',
    h2: 'my-h2',
    // ... etc
  },
  text: {
    bold: 'my-bold',
    italic: 'my-italic',
    // ... etc
  }
};

// Then in your CSS file
.my-toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  background: #f9f9f9;
}

.my-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 200px;
}

.my-content {
  padding: 16px;
  outline: none;
  min-height: 200px;
}

.my-bold { font-weight: bold; }
.my-italic { font-style: italic; }
// ... etc
```

#### Option 2: Tailwind CSS Classes
Use Tailwind classes directly in your theme:

```tsx
const theme = {
  toolbar: 'flex gap-2 p-2 border-b border-gray-300 bg-gray-50',
  editor: 'border border-gray-300 rounded min-h-[200px]',
  contentEditable: 'p-4 outline-none min-h-[200px]',
  paragraph: 'mb-4',
  heading: {
    h1: 'text-3xl font-bold mb-4 text-blue-600',
    h2: 'text-2xl font-semibold mb-3 text-blue-500',
    h3: 'text-xl font-medium mb-2 text-blue-400',
  },
  text: {
    bold: 'font-bold text-red-600',
    italic: 'italic text-green-600',
    underline: 'underline decoration-blue-500',
    strikethrough: 'line-through text-gray-500'
  }
};
```

#### Option 3: Inline Styles
For quick prototyping, use inline styles as shown in the example above.

**💡 Pro Tip:** Check out the [default theme](https://github.com/novincode/lexkit/blob/main/apps/web/app/templates/default/theme.ts) and [styles](https://github.com/novincode/lexkit/blob/main/apps/web/app/templates/default/styles.css) for a complete reference!

---

## 🔧 Built on Lexical

LexKit is built on top of [Lexical](https://lexical.dev/), the powerful editor framework by Meta. This gives you:

- **Performance**: Virtual DOM-based rendering
- **Accessibility**: Full keyboard navigation and screen reader support
- **Extensibility**: Plugin architecture for custom functionality
- **Serialization**: JSON-based document model
- **Collaboration**: Real-time editing support (via Lexical)

**You need to install Lexical packages:**
```bash
npm install lexical @lexical/react @lexical/html @lexical/markdown @lexical/list @lexical/rich-text @lexical/selection @lexical/utils @lexical/code
```

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

- **[📖 Full Documentation](https://lexkit.codeideal.com)** - Complete API reference
- **[🚀 Interactive Demo](https://lexkit.codeideal.com/demo)** - Try it live
- **[� Live Playground](https://stackblitz.com/edit/vitejs-vite-bpg2kpze)** - Experiment with LexKit
- **[�📝 Examples](https://lexkit.codeideal.com/examples)** - Real-world implementations
- **[💬 Discord Community](https://discord.gg/hAvRFC9Y)** - Get help and share ideas

*📝 **Coming Soon**: Comprehensive documentation website with playground, tutorials, and advanced examples*

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) and [Development Notes](./docs/improvement_NOTES.md).

---

## 📄 License

MIT © [LexKit Team](https://github.com/novincode/lexkit)

---

<div align="center">

**Made with ❤️ by the LexKit team**

[⭐ Star us on GitHub](https://github.com/novincode/lexkit) • [🐛 Report Issues](https://github.com/novincode/lexkit/issues) • [💝 Sponsor](https://github.com/sponsors/lexkit)

</div>