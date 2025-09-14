# LexKit Styling Guide

## Overview

LexKit is **headless by design** - you control all the styling! There are several ways to customize the editor's appearance to match your application's design system.

## Theme System

LexKit uses a structured theme system that maps CSS classes to different editor elements:

```tsx
const theme = {
  // Toolbar styling
  toolbar: "my-toolbar-class",

  // Editor container
  editor: "my-editor-class",
  contentEditable: "my-content-class",

  // Node-specific styling
  paragraph: "my-paragraph-class",
  heading: {
    h1: "my-h1-class",
    h2: "my-h2-class",
    // ... etc
  },

  // Text formatting
  text: {
    bold: "my-bold-class",
    italic: "my-italic-class",
    underline: "my-underline-class",
    strikethrough: "my-strikethrough-class",
    code: "my-code-class",
  },

  // Other elements
  list: {
    ul: "my-ul-class",
    ol: "my-ol-class",
    li: "my-li-class",
  },
  quote: "my-quote-class",
  link: "my-link-class",
  image: "my-image-class",
};

<Provider extensions={extensions} config={{ theme }}>
  <YourEditor />
</Provider>;
```

## Styling Approaches

### 1. CSS Classes (Recommended)

Define your theme with CSS class names and style them in your CSS:

```tsx
const theme = {
  toolbar: "editor-toolbar",
  editor: "editor-container",
  contentEditable: "editor-content",
  text: {
    bold: "text-bold",
    italic: "text-italic",
  },
};
```

```css
/* In your CSS file */
.editor-toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
}

.editor-container {
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  min-height: 200px;
}

.editor-content {
  padding: 16px;
  outline: none;
  min-height: 200px;
  line-height: 1.6;
}

.text-bold {
  font-weight: 700;
}
.text-italic {
  font-style: italic;
}
```

### 2. Tailwind CSS Classes

Use Tailwind utility classes directly in your theme:

```tsx
const theme = {
  toolbar: "flex gap-2 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md",
  editor: "border border-gray-200 rounded-md min-h-[200px] shadow-sm",
  contentEditable: "p-4 outline-none min-h-[200px] prose prose-sm max-w-none",
  text: {
    bold: "font-bold text-gray-900",
    italic: "italic text-gray-700",
    underline: "underline decoration-blue-500",
    strikethrough: "line-through text-gray-500",
    code: "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono",
  },
  heading: {
    h1: "text-3xl font-bold mb-4 text-gray-900",
    h2: "text-2xl font-semibold mb-3 text-gray-800",
    h3: "text-xl font-medium mb-2 text-gray-700",
  },
};
```

### 3. CSS-in-JS / Styled Components

For component-based styling:

```tsx
const theme = {
  toolbar: "toolbar-component",
  editor: "editor-component",
  // ... other classes
};
```

```tsx
// In your styled components
const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
`;

const EditorContainer = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  min-height: 200px;
`;
```

### 4. Inline Styles

For quick prototyping or dynamic styling:

```tsx
function MyEditor() {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        minHeight: "200px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "8px",
          borderBottom: "1px solid #ccc",
        }}
      >
        {/* Toolbar buttons */}
      </div>

      <RichText
        placeholder="Start writing..."
        style={{
          padding: "16px",
          outline: "none",
          minHeight: "200px",
        }}
      />
    </div>
  );
}
```

## Complete Theme Example

Here's a comprehensive theme with modern styling:

```tsx
const modernTheme = {
  // Layout
  toolbar: "flex gap-1 p-3 border-b border-gray-200 bg-white sticky top-0 z-10",
  editor:
    "border border-gray-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
  contentEditable: "p-4 outline-none min-h-[300px] prose prose-gray max-w-none",

  // Typography
  paragraph: "mb-4 text-gray-700 leading-relaxed",
  heading: {
    h1: "text-4xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-2",
    h2: "text-3xl font-semibold mb-4 text-gray-800 mt-8",
    h3: "text-2xl font-medium mb-3 text-gray-700 mt-6",
    h4: "text-xl font-medium mb-2 text-gray-700 mt-4",
    h5: "text-lg font-medium mb-2 text-gray-700 mt-4",
    h6: "text-base font-medium mb-2 text-gray-700 mt-4",
  },

  // Text formatting
  text: {
    bold: "font-semibold text-gray-900",
    italic: "italic text-gray-700",
    underline: "underline decoration-blue-500 decoration-2",
    strikethrough: "line-through text-gray-500",
    code: "bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border",
  },

  // Lists
  list: {
    ul: "list-disc list-inside mb-4 space-y-1",
    ol: "list-decimal list-inside mb-4 space-y-1",
    li: "text-gray-700",
  },

  // Block elements
  quote:
    "border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2 pr-4 rounded-r",
  codeHighlight: {
    atrule: "text-purple-600",
    attr: "text-blue-600",
    boolean: "text-red-600",
    builtin: "text-purple-600",
    cdata: "text-gray-600",
    char: "text-green-600",
    class: "text-blue-600",
    "class-name": "text-blue-600",
    comment: "text-gray-500 italic",
    constant: "text-red-600",
    deleted: "text-red-600 line-through",
    doctype: "text-gray-600",
    entity: "text-yellow-600",
    function: "text-purple-600",
    important: "text-red-600 font-bold",
    inserted: "text-green-600",
    keyword: "text-blue-600",
    namespace: "text-blue-600",
    number: "text-red-600",
    operator: "text-gray-700",
    prolog: "text-gray-600",
    property: "text-blue-600",
    punctuation: "text-gray-700",
    regex: "text-green-600",
    selector: "text-blue-600",
    string: "text-green-600",
    symbol: "text-red-600",
    tag: "text-red-600",
    url: "text-blue-600 underline",
    variable: "text-orange-600",
  },

  // Interactive elements
  link: "text-blue-600 hover:text-blue-800 underline decoration-blue-600 hover:decoration-blue-800",
  image: "max-w-full h-auto rounded-lg shadow-sm border border-gray-200",
};
```

## CSS Variables for Dynamic Theming

Use CSS variables for runtime theme switching:

```css
:root {
  --editor-border: #e1e5e9;
  --editor-bg: #ffffff;
  --editor-text: #374151;
  --editor-accent: #3b82f6;
}

[data-theme="dark"] {
  --editor-border: #374151;
  --editor-bg: #1f2937;
  --editor-text: #f9fafb;
  --editor-accent: #60a5fa;
}

.editor-container {
  border: 1px solid var(--editor-border);
  background: var(--editor-bg);
  color: var(--editor-text);
}
```

## Best Practices

1. **Consistent naming** - Use a prefix for your classes (e.g., `my-editor-`)
2. **Responsive design** - Consider mobile layouts
3. **Accessibility** - Ensure good contrast ratios
4. **Performance** - Avoid heavy styles that impact rendering
5. **Maintainability** - Keep your theme organized and documented

## Default Theme Reference

Check out the [default theme](https://github.com/novincode/lexkit/blob/main/apps/web/app/templates/default/theme.ts) and [styles](https://github.com/novincode/lexkit/blob/main/apps/web/app/templates/default/styles.css) for a complete reference implementation.

## Troubleshooting

### Styles not applying?

- Ensure your CSS is loaded after LexKit's styles
- Check for CSS specificity conflicts
- Verify class names match your theme configuration

### Theme not updating?

- Themes are applied at render time
- For dynamic theme changes, re-mount the Provider
- CSS variable changes require DOM updates

### Performance issues?

- Avoid complex CSS selectors
- Use CSS containment for better performance
- Minimize layout shifts during styling changes
