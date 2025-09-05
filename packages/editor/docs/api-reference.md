# LexKit Editor API Reference

## Core Functions

### createEditorSystem

```tsx
function createEditorSystem<Extensions>() => {
  Provider: React.Component
  useEditor: () => EditorContext
}
```

Creates a typed editor system based on the provided extensions array.

**Type Parameters:**
- `Extensions`: Array of extension instances

**Returns:**
- `Provider`: React component that provides editor context
- `useEditor`: Hook to access editor functionality

**Example:**
```tsx
const extensions = [boldExtension, italicExtension] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();
```

## Hooks

### useEditor

```tsx
const {
  commands,        // Available commands
  activeStates,    // Current editor state
  hasExtension,    // Check extension availability
  lexical,         // Raw Lexical editor instance
  export,          // Export functions
  import          // Import functions
} = useEditor();
```

Access the editor context within a Provider.

## Commands

Commands are functions that modify the editor state. Available commands depend on loaded extensions.

### Base Commands

- `formatText(format, value?)`: Apply text formatting

### Extension Commands

#### Text Formatting
- `toggleBold()`: Toggle bold formatting
- `toggleItalic()`: Toggle italic formatting
- `toggleUnderline()`: Toggle underline formatting
- `toggleStrikethrough()`: Toggle strikethrough formatting

#### Structure
- `toggleHeading(level)`: Toggle heading (h1-h6)
- `toggleParagraph()`: Convert to paragraph
- `toggleQuote()`: Toggle blockquote
- `toggleUnorderedList()`: Toggle bullet list
- `toggleOrderedList()`: Toggle numbered list

#### History
- `undo()`: Undo last action
- `redo()`: Redo last undone action

#### Media
- `insertImage(payload)`: Insert image
- `setImageAlignment(alignment)`: Set image alignment
- `setImageCaption(caption)`: Set image caption

#### Export/Import
- `exportToHTML()`: Export content as HTML
- `importFromHTML(html)`: Import HTML content
- `exportToMarkdown()`: Export content as Markdown
- `importFromMarkdown(md)`: Import Markdown content

## State Queries

State queries are async functions that return the current editor state.

### Available States

- `bold`: Boolean - Bold formatting is active
- `italic`: Boolean - Italic formatting is active
- `underline`: Boolean - Underline formatting is active
- `strikethrough`: Boolean - Strikethrough formatting is active
- `unorderedList`: Boolean - Unordered list is active
- `orderedList`: Boolean - Ordered list is active
- `isH1`, `isH2`, etc.: Boolean - Current block is heading
- `isQuote`: Boolean - Current block is quote
- `canUndo`: Boolean - Undo is available
- `canRedo`: Boolean - Redo is available
- `imageSelected`: Boolean - Image is selected
- `isHTMLEmbedSelected`: Boolean - HTML embed is selected

## Extensions

### Text Formatting Extensions

#### BoldExtension
Provides bold text formatting.

```tsx
import { boldExtension } from '@repo/editor/extensions';
```

#### ItalicExtension
Provides italic text formatting.

#### UnderlineExtension
Provides underline text formatting.

#### StrikethroughExtension
Provides strikethrough text formatting.

### Structure Extensions

#### BlockFormatExtension
Provides heading, paragraph, and quote formatting.

#### ListExtension
Provides bulleted and numbered list functionality.

### Media Extensions

#### ImageExtension
Provides image insertion and management.

**Configuration:**
```tsx
const configuredImageExtension = imageExtension.configure({
  uploadHandler: async (file: File) => string,
  defaultAlignment: 'center' | 'left' | 'right' | 'none',
  resizable: boolean,
  pasteListener: { insert: boolean, replace: boolean },
  debug: boolean
});
```

#### HTMLEmbedExtension
Provides HTML embed functionality.

### Export/Import Extensions

#### HTMLExtension
Provides HTML export/import functionality.

#### MarkdownExtension
Provides Markdown export/import functionality.

### Utility Extensions

#### HistoryExtension
Provides undo/redo functionality.

## Configuration

### EditorConfig

```tsx
interface EditorConfig {
  theme?: Record<string, any>;
  placeholder?: string;
  [key: string]: any;
}
```

### Extension Configuration

Extensions can be configured using the `configure()` method:

```tsx
const configuredExtension = extension.configure({
  // extension-specific config
});
```

## Types

### Extension Categories

```tsx
enum ExtensionCategory {
  Toolbar = 'toolbar',
  Sidebar = 'sidebar',
  ContextMenu = 'contextmenu',
  Floating = 'floating'
}
```

### Base Extension Config

```tsx
interface BaseExtensionConfig {
  showInToolbar?: boolean;
  category?: ExtensionCategory[];
  [key: string]: any;
}
```

## Error Handling

The editor includes comprehensive error handling:

- Extension registration errors are logged
- Content import/export errors are caught and logged
- Invalid configurations fall back to defaults
- Editor state corruption is handled gracefully

## Best Practices

1. **Type Safety**: Always use `as const` for extension arrays
2. **Error Handling**: Wrap editor operations in try-catch blocks
3. **Performance**: Memoize expensive operations
4. **Accessibility**: Provide proper ARIA labels
5. **Testing**: Test with various extension combinations
