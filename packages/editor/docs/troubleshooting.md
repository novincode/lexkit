# LexKit Troubleshooting Guide

## Common Issues & Solutions

### Editor Not Rendering

**Problem**: The editor appears blank or doesn't show up.

**Solutions**:

1. **Built-in Error Handling**: The `richTextExtension` includes automatic error boundaries, but you can still add your own for additional safety:

```tsx
import { ErrorBoundary } from "react-error-boundary";

function EditorWithErrorBoundary() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <YourEditor />
    </ErrorBoundary>
  );
}
```

2. **Verify Provider Setup**: Ensure you're using the Provider correctly:

```tsx
import { Provider } from "@lexkit/editor";

function App() {
  return (
    <Provider extensions={extensions} config={config}>
      <YourEditor />
    </Provider>
  );
}
```

3. **Check Console Errors**: Open browser dev tools and look for:
   - Missing dependencies
   - TypeScript errors
   - Lexical framework errors

### Extensions Not Working

**Problem**: Extensions aren't loading or functioning.

**Solutions**:

1. **Verify Extension Registration**:

```tsx
import { HistoryExtension, TextFormatExtension } from "@lexkit/editor";

const extensions = [HistoryExtension, TextFormatExtension];
```

2. **Check Extension Dependencies**: Some extensions require others:

```tsx
// HistoryExtension requires Lexical's HistoryPlugin
const extensions = [
  HistoryExtension, // Must come before other extensions
  TextFormatExtension,
];
```

3. **Extension Order Matters**: Order extensions by dependency:

```tsx
const extensions = [
  // Core extensions first
  HistoryExtension,
  // Then formatting
  TextFormatExtension,
  // Then custom extensions
  YourCustomExtension,
];
```

### Styling Issues

**Problem**: Editor doesn't look right or styles aren't applying.

**Solutions**:

1. **Check Theme Configuration**:

```tsx
const config = {
  theme: {
    editor: "your-editor-class",
    toolbar: "your-toolbar-class",
  },
};
```

2. **CSS Loading Order**: Ensure your CSS loads after LexKit's styles:

```html
<!-- Load LexKit first -->
<link rel="stylesheet" href="lexkit-styles.css" />
<!-- Then your custom styles -->
<link rel="stylesheet" href="your-styles.css" />
```

3. **CSS Specificity**: Use more specific selectors if needed:

```css
/* Instead of */
.editor {
  border: 1px solid red;
}

/* Use */
.my-app .editor {
  border: 1px solid red;
}
```

### TypeScript Errors

**Problem**: TypeScript compilation fails.

**Solutions**:

1. **Check Type Definitions**: Ensure you have the latest types:

```bash
npm install @lexkit/editor@latest
```

2. **Import Types Correctly**:

```tsx
import type { EditorConfig, Extension } from "@lexkit/editor";
```

3. **Generic Type Issues**: Provide explicit types when needed:

```tsx
const config: EditorConfig = {
  theme: yourTheme,
  namespace: "MyEditor",
};
```

### Build & Bundle Issues

**Problem**: Build fails or bundle size is too large.

**Solutions**:

1. **Tree Shaking**: Import only what you need:

```tsx
// Good
import { Provider, HistoryExtension } from "@lexkit/editor";

// Avoid
import * as LexKit from "@lexkit/editor";
```

2. **Bundle Analyzer**: Check what's taking up space:

```bash
npx webpack-bundle-analyzer dist/static/js/*.js
```

3. **Dynamic Imports**: Load extensions dynamically:

```tsx
const extensions = await import("./extensions");
```

### Performance Issues

**Problem**: Editor is slow or laggy.

**Solutions**:

1. **Debounce Updates**: For frequent updates:

```tsx
import { useDebounce } from "use-debounce";

const [value, setValue] = useState("");
const debouncedValue = useDebounce(value, 300);
```

2. **Memoize Components**:

```tsx
const Toolbar = React.memo(({ children }) => (
  <div className="toolbar">{children}</div>
));
```

3. **Virtual Scrolling**: For large documents:

```tsx
// Use react-window or similar for large content
```

### Plugin Conflicts

**Problem**: Multiple plugins interfering with each other.

**Solutions**:

1. **Isolate Plugins**: Test extensions individually:

```tsx
// Test one at a time
const extensions = [HistoryExtension]; // Only one extension
```

2. **Check Plugin Order**: Some plugins need specific ordering:

```tsx
const extensions = [
  // History first
  HistoryExtension,
  // Then others
  TextFormatExtension,
  // Custom last
  YourExtension,
];
```

3. **Plugin Configuration**: Ensure proper configuration:

```tsx
const config = {
  plugins: {
    history: { maxUndoRedoSteps: 10 },
    // Other plugin configs
  },
};
```

### Content Serialization Issues

**Problem**: Content not saving/loading correctly.

**Solutions**:

1. **Use Correct Format**: Match export/import formats:

```tsx
// Export
const html = editor.getHTML();
const json = editor.getJSON();

// Import
editor.setHTML(html);
editor.setJSON(json);
```

2. **Handle Errors**: Wrap serialization in try-catch:

```tsx
try {
  const content = editor.getHTML();
  localStorage.setItem("editor-content", content);
} catch (error) {
  console.error("Failed to save content:", error);
}
```

3. **Validate Content**: Check content before loading:

```tsx
const savedContent = localStorage.getItem("editor-content");
if (savedContent) {
  try {
    editor.setHTML(savedContent);
  } catch (error) {
    console.error("Failed to load content:", error);
  }
}
```

### Browser Compatibility

**Problem**: Editor doesn't work in certain browsers.

**Solutions**:

1. **Check Browser Support**: LexKit supports:
   - Chrome 60+
   - Firefox 55+
   - Safari 11+
   - Edge 79+

2. **Polyfills**: Add necessary polyfills:

```tsx
import "core-js/stable";
import "regenerator-runtime/runtime";
```

3. **CSS Support**: Ensure CSS Grid and Flexbox support:

```css
/* Fallback for older browsers */
.editor {
  display: flex;
  display: -webkit-flex;
}
```

### Development Environment Issues

**Problem**: Editor works in development but not production.

**Solutions**:

1. **Build Configuration**: Check your build setup:

```tsx
// next.config.js
module.exports = {
  transpilePackages: ["@lexkit/editor"],
};
```

2. **Environment Variables**: Ensure proper env setup:

```bash
NODE_ENV=production npm run build
```

3. **Static Assets**: Verify static files are served correctly:

```tsx
// Check if CSS/JS files are accessible
```

## Getting Help

If you're still having issues:

1. **Check the Documentation**: Review the [API Reference](api-reference.md) and [Getting Started](getting-started.md) guides.

2. **Search Issues**: Look for similar issues in the [GitHub repository](https://github.com/novincode/lexkit/issues).

3. **Create an Issue**: If you can't find a solution, [open a new issue](https://github.com/novincode/lexkit/issues/new) with:
   - Your LexKit version
   - Browser and OS information
   - Code sample that reproduces the issue
   - Error messages and stack traces

4. **Community Support**: Join our [Discord community](https://discord.gg/lexkit) for real-time help.

## Debug Mode

Enable debug mode for additional logging:

```tsx
const config = {
  debug: true,
  logLevel: "verbose",
};
```

This will provide detailed console logs to help identify issues.
