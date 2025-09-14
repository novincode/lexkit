# LexKit Performance Guide

## Overview

LexKit is built for performance, but like any rich text editor, there are optimization opportunities. This guide covers techniques to keep your editor fast and responsive.

## Core Performance Principles

### 1. Minimal Re-renders

LexKit uses React's reconciliation efficiently, but you can help by:

```tsx
// Use React.memo for toolbar components
const ToolbarButton = React.memo(({ active, onClick, children }) => (
  <button className={`toolbar-btn ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
));

// Memoize expensive computations
const toolbarItems = React.useMemo(
  () => [
    { icon: BoldIcon, command: "bold" },
    { icon: ItalicIcon, command: "italic" },
    // ... more items
  ],
  [],
);
```

### 2. Debounced Updates

For frequent content changes, debounce saves:

```tsx
import { useDebounce } from "use-debounce";

function AutoSaveEditor() {
  const [content, setContent] = useState("");
  const debouncedContent = useDebounce(content, 1000);

  // Save only when debouncedContent changes
  React.useEffect(() => {
    if (debouncedContent) {
      saveToStorage(debouncedContent);
    }
  }, [debouncedContent]);

  return <Editor value={content} onChange={setContent} />;
}
```

## Bundle Size Optimization

### Tree Shaking

Import only what you need:

```tsx
// ✅ Good - Only imports what you use
import {
  Provider,
  HistoryExtension,
  TextFormatExtension,
} from "@lexkit/editor";

// ❌ Bad - Imports everything
import * as LexKit from "@lexkit/editor";

// ✅ Better - Import types separately
import type { EditorConfig } from "@lexkit/editor";
import { Provider } from "@lexkit/editor";
```

### Dynamic Imports

Load extensions on demand:

```tsx
const [extensions, setExtensions] = useState([]);

useEffect(() => {
  // Load extensions dynamically
  import("./extensions").then(({ default: exts }) => {
    setExtensions(exts);
  });
}, []);
```

### Bundle Analysis

Use tools to identify large dependencies:

```bash
# Webpack Bundle Analyzer
npx webpack-bundle-analyzer dist/static/js/*.js

# Rollup Plugin
npx rollup-plugin-visualizer dist/stats.html
```

## Memory Management

### Large Document Handling

For documents with many nodes:

```tsx
// Use virtual scrolling for large documents
import { FixedSizeList as List } from "react-window";

// Limit undo/redo history
const config = {
  history: {
    maxUndoRedoSteps: 50, // Default is 1000
  },
};
```

### Cleanup Event Listeners

LexKit handles most cleanup, but for custom extensions:

```tsx
class MyExtension extends BaseExtension {
  cleanup() {
    // Remove any custom event listeners
    window.removeEventListener("resize", this.handleResize);
  }
}
```

## Rendering Optimizations

### CSS Containment

Use CSS containment for better performance:

```css
.editor-container {
  contain: layout style paint;
}

.editor-content {
  contain: layout style;
}
```

### Avoid Layout Thrashing

Batch DOM updates:

```tsx
// Instead of multiple style changes
element.style.width = "100px";
element.style.height = "100px";
element.style.margin = "10px";

// Use a single class change
element.className = "optimized-styles";
```

### Image Optimization

For image-heavy content:

```tsx
// Lazy load images
const LazyImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={loaded ? src : placeholder}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
    />
  );
};
```

## Extension Performance

### Efficient Extension Design

Write performant extensions:

```tsx
class OptimizedExtension extends BaseExtension {
  // Use requestAnimationFrame for animations
  updateUI = () => {
    requestAnimationFrame(() => {
      // Update UI
    });
  };

  // Debounce expensive operations
  handleInput = debounce((value) => {
    this.processValue(value);
  }, 150);
}
```

### Extension Loading Strategy

Load extensions based on user needs:

```tsx
const getExtensions = (userPlan) => {
  const baseExtensions = [HistoryExtension];

  if (userPlan === "pro") {
    return [...baseExtensions, ImageExtension, TableExtension];
  }

  return baseExtensions;
};
```

## Network Optimization

### Content Loading

Optimize content fetching:

```tsx
// Use React Query for caching
import { useQuery } from "react-query";

function EditorWithContent({ documentId }) {
  const { data: content } = useQuery(
    ["document", documentId],
    () => fetchDocument(documentId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  );

  return <Editor initialContent={content} />;
}
```

### Real-time Collaboration

For collaborative editing:

```tsx
// Use operational transforms or CRDTs
import { useYjs } from "react-yjs";

function CollaborativeEditor() {
  const [content, setContent] = useState("");

  // Sync with other users
  useYjs({
    content,
    onChange: setContent,
  });

  return <Editor value={content} onChange={setContent} />;
}
```

## Monitoring & Profiling

### Performance Monitoring

Track editor performance:

```tsx
// Use React DevTools Profiler
import { Profiler } from "react";

<Profiler id="editor" onRender={onRenderCallback}>
  <Editor />
</Profiler>;

// Custom performance tracking
const trackPerformance = () => {
  const start = performance.now();

  // Editor operation
  editor.insertText("Hello");

  const end = performance.now();
  console.log(`Operation took ${end - start}ms`);
};
```

### Memory Leak Detection

Monitor for memory leaks:

```tsx
// Use React DevTools Memory tab
// Or add custom tracking
useEffect(() => {
  const interval = setInterval(() => {
    if (performance.memory) {
      console.log("Memory usage:", performance.memory.usedJSHeapSize);
    }
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

## Configuration Optimizations

### Editor Configuration

Optimize editor settings:

```tsx
const optimizedConfig = {
  // Reduce re-renders
  namespace: "OptimizedEditor",

  // Limit features for better performance
  theme: minimalTheme,

  // Disable unused features
  disabled: {
    spellcheck: true,
    grammar: true,
  },

  // Optimize plugins
  plugins: {
    history: {
      maxUndoRedoSteps: 50,
    },
    autocomplete: {
      debounceMs: 200,
    },
  },
};
```

### Build Optimizations

Configure your build for better performance:

```tsx
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```

## Advanced Techniques

### Web Workers

Offload heavy processing:

```tsx
// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// In your component
const worker = new Worker("worker.js");

const handleHeavyTask = (data) => {
  worker.postMessage(data);
  worker.onmessage = (e) => {
    // Handle result
  };
};
```

### Service Worker Caching

Cache editor assets:

```tsx
// service-worker.js
const CACHE_NAME = "lexkit-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/editor.js",
        "/editor.css",
        // Other assets
      ]);
    }),
  );
});
```

## Performance Checklist

- [ ] Use React.memo for components
- [ ] Debounce frequent updates
- [ ] Tree shake imports
- [ ] Use dynamic imports for large features
- [ ] Implement virtual scrolling for large content
- [ ] Use CSS containment
- [ ] Optimize images and media
- [ ] Monitor bundle size
- [ ] Profile with React DevTools
- [ ] Cache network requests
- [ ] Use service workers for assets

## Measuring Performance

### Key Metrics

Track these performance indicators:

```tsx
// Time to interactive
const measureTTI = () => {
  // Use Performance API
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log("TTI:", entry.startTime);
    }
  });
  observer.observe({ entryTypes: ["measure"] });
};

// Memory usage
const measureMemory = () => {
  if (performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    };
  }
};
```

### Performance Budgets

Set performance goals:

```tsx
// Bundle size budget
const BUDGETS = {
  bundleSize: "200KB",
  firstPaint: "1000ms",
  timeToInteractive: "3000ms",
};
```

## Common Performance Issues

### Slow Initial Load

- **Cause**: Large bundle size
- **Solution**: Code splitting, lazy loading

### Laggy Typing

- **Cause**: Excessive re-renders
- **Solution**: Debounce, memoization

### Memory Leaks

- **Cause**: Uncleaned event listeners
- **Solution**: Proper cleanup in useEffect

### Large Document Slowness

- **Cause**: Too many DOM nodes
- **Solution**: Virtual scrolling, pagination

Remember: Performance optimization is iterative. Start with the biggest impact changes and measure as you go!
