import { RegisteredCodeSnippet } from "@/app/(docs)/lib/types";

export const THEMING_CODES: RegisteredCodeSnippet[] = [
  {
    id: "theming-basic-usage",
    code: `import { LexKitTheme } from '@lexkit/editor'

const myTheme: LexKitTheme = {
  // Content styling
  paragraph: 'mb-4 text-gray-800',
  heading: {
    h1: 'text-2xl font-bold mb-4',
    h2: 'text-xl font-semibold mb-3',
    h3: 'text-lg font-medium mb-2',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
  },
  quote: 'border-l-4 border-gray-300 pl-4 italic',
  link: 'text-blue-600 hover:text-blue-800 underline',

  // Toolbar styling
  toolbar: {
    button: 'px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors',
    buttonActive: 'bg-blue-100 text-blue-700',
    buttonDisabled: 'opacity-50 cursor-not-allowed',
    group: 'flex gap-1 border border-gray-200 rounded p-1',
  },

  // Container styling
  container: 'border border-gray-200 rounded-lg overflow-hidden',
  wrapper: 'min-h-[200px] p-4',
  richText: {
    contentEditable: 'outline-none',
    placeholder: 'text-gray-400 italic',
  },
}`,
    language: "typescript",
    title: "Basic Theme Definition",
    description: "Create a custom theme object with all available properties",
    highlightLines: [
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
    ],
  },
  {
    id: "theming-apply-theme",
    code: `<Provider
  extensions={extensions}
  config={{ theme: myTheme }}
>
  <MyEditor />
</Provider>`,
    language: "tsx",
    title: "Apply Theme to Editor",
    description: "Apply your custom theme to the LexKit editor",
    highlightLines: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "theming-tailwind-theme",
    code: `import { LexKitTheme } from '@lexkit/editor'

const tailwindTheme: LexKitTheme = {
  // Content styling
  paragraph: 'mb-4 text-gray-800 leading-relaxed',
  heading: {
    h1: 'text-3xl font-bold mb-6 text-gray-900',
    h2: 'text-2xl font-bold mb-4 text-gray-900',
    h3: 'text-xl font-semibold mb-3 text-gray-900',
  },
  text: {
    bold: 'font-bold text-gray-900',
    italic: 'italic text-gray-700',
    underline: 'underline decoration-blue-500',
  },
  quote: 'border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4',

  // Toolbar styling
  toolbar: {
    button: 'px-3 py-2 text-sm font-medium rounded-md transition-colors',
    buttonActive: 'bg-blue-600 text-white shadow-sm',
    buttonDisabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',
    group: 'flex gap-2'
  },

  // Container styling
  container: 'border border-gray-200 rounded-lg overflow-hidden',
  wrapper: 'min-h-[300px] p-4',
  richText: {
    contentEditable: 'outline-none min-h-[200px]',
    placeholder: 'text-gray-400 italic'
  }
}`,
    language: "typescript",
    title: "Tailwind CSS Theme",
    description: "Complete theme using Tailwind utility classes",
    highlightLines: [
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28, 29, 30, 31, 32,
    ],
  },
  {
    id: "theming-merge-themes",
    code: `import { mergeThemes, defaultLexKitTheme, LexKitTheme } from '@lexkit/editor'

// Start with default theme
const baseTheme = defaultLexKitTheme

// Override specific properties
const customOverrides: Partial<LexKitTheme> = {
  text: {
    bold: 'my-custom-bold-class',
    italic: 'my-custom-italic-class',
  },
  toolbar: {
    button: 'my-toolbar-button',
    buttonActive: 'my-toolbar-button-active',
  },
  container: 'my-editor-container',
}

// Merge themes
const finalTheme = mergeThemes(baseTheme, customOverrides)

// Use the merged theme
<Provider extensions={extensions} config={{ theme: finalTheme }}>
  <MyEditor />
</Provider>`,
    language: "typescript",
    title: "Theme Merging",
    description: "Combine themes or override specific properties",
    highlightLines: [
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    ],
  },
  {
    id: "theming-css-variables",
    code: `/* CSS with custom properties */
:root {
  --editor-bg: #ffffff;
  --editor-text: #1f2937;
  --editor-border: #e5e7eb;
  --button-primary: #3b82f6;
  --button-hover: #2563eb;
}

.dark {
  --editor-bg: #1f2937;
  --editor-text: #f9fafb;
  --editor-border: #374151;
  --button-primary: #60a5fa;
  --button-hover: #3b82f6;
}

/* Theme using CSS variables */
const responsiveTheme: LexKitTheme = {
  container: 'border border-[var(--editor-border)] rounded-lg bg-[var(--editor-bg)]',
  paragraph: 'text-[var(--editor-text)] mb-4 leading-relaxed',
  text: {
    bold: 'font-bold text-[var(--editor-text)]',
  },
  toolbar: {
    button: 'px-3 py-2 bg-[var(--button-primary)] hover:bg-[var(--button-hover)] text-white rounded-md transition-colors',
  },
}`,
    language: "typescript",
    title: "CSS Variables Theme",
    description: "Dynamic theming with CSS custom properties",
    highlightLines: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
  },
  {
    id: "theming-extension-specific",
    code: `const themeWithExtensions: LexKitTheme = {
  // Base properties
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-bold',
  },

  // Draggable blocks extension
  draggable: {
    handle: 'absolute -left-8 top-0 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded cursor-move flex items-center justify-center',
    handleHover: 'bg-gray-300',
    handleDragging: 'bg-blue-500',
    blockDragging: 'opacity-50 border-2 border-blue-500 border-dashed',
    dropIndicator: 'h-1 bg-blue-500 my-2 rounded',
    upButton: 'absolute -left-6 -top-3 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs hover:bg-gray-50',
    downButton: 'absolute -left-6 -bottom-3 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs hover:bg-gray-50',
    blockIsDragging: 'shadow-lg transform rotate-2',
    buttonStack: 'flex flex-col gap-1',
  },

  // Floating toolbar extension
  floatingToolbar: {
    container: 'absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex gap-1',
    button: 'w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm',
    buttonActive: 'bg-blue-100 text-blue-700',
  },
}`,
    language: "typescript",
    title: "Extension-Specific Theming",
    description:
      "Theme properties for specific extensions like draggable blocks and floating toolbar",
    highlightLines: [
      6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
    ],
  },
  {
    id: "theming-dynamic-theme-switching",
    code: `"use client"

import { useState } from 'react'
import { LexKitTheme } from '@lexkit/editor'

const lightTheme: LexKitTheme = {
  container: 'bg-white border-gray-200',
  paragraph: 'text-gray-900',
  toolbar: {
    button: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  },
}

const darkTheme: LexKitTheme = {
  container: 'bg-gray-900 border-gray-700',
  paragraph: 'text-white',
  toolbar: {
    button: 'bg-gray-700 hover:bg-gray-600 text-white',
  },
}

function ThemeableEditor() {
  const [isDark, setIsDark] = useState(false)
  const currentTheme = isDark ? darkTheme : lightTheme

  return (
    <div>
      <button
        onClick={() => setIsDark(!isDark)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle {isDark ? 'Light' : 'Dark'} Theme
      </button>

      <Provider extensions={extensions} config={{ theme: currentTheme }}>
        <MyEditor />
      </Provider>
    </div>
  )
}`,
    language: "tsx",
    title: "Dynamic Theme Switching",
    description:
      "Change themes dynamically based on user interaction or application state",
    highlightLines: [
      5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
      43, 44, 45,
    ],
  },
  {
    id: "theming-migration-before",
    code: `const lexicalTheme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-bold',
  },
}

<LexicalComposer initialConfig={{ theme: lexicalTheme }}>
  <Editor />
</LexicalComposer>`,
    language: "tsx",
    title: "Lexical Theme (Before)",
    description: "Traditional Lexical theme setup",
    highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    id: "theming-migration-after",
    code: `import { LexKitTheme } from '@lexkit/editor'

const lexkitTheme: LexKitTheme = {
  ...lexicalTheme,
  toolbar: {
    button: 'toolbar-button',
  },
  container: 'editor-container',
}

<Provider extensions={extensions} config={{ theme: lexkitTheme }}>
  <MyEditor />
</Provider>`,
    language: "tsx",
    title: "LexKit Theme (After)",
    description: "Enhanced LexKit theme with additional properties",
    highlightLines: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "theming-component-level",
    code: `import { LexKitTheme } from '@lexkit/editor'

// Different themes for different editor instances
const minimalTheme: LexKitTheme = {
  container: 'border border-gray-200 rounded',
  paragraph: 'text-sm text-gray-700',
  toolbar: {
    button: 'w-6 h-6 text-xs',
  },
}

const richTheme: LexKitTheme = {
  container: 'border-2 border-blue-200 rounded-lg shadow-lg',
  paragraph: 'text-base text-gray-900 leading-relaxed',
  heading: {
    h1: 'text-3xl font-bold text-blue-900',
  },
  toolbar: {
    button: 'px-4 py-2 text-sm font-medium bg-blue-50 hover:bg-blue-100',
    buttonActive: 'bg-blue-200',
  },
}

function MultiEditorApp() {
  return (
    <div className="space-y-8">
      {/* Minimal editor for comments */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Comment Editor</h3>
        <Provider extensions={basicExtensions} config={{ theme: minimalTheme }}>
          <CommentEditor />
        </Provider>
      </div>

      {/* Rich editor for content creation */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Content Editor</h3>
        <Provider extensions={richExtensions} config={{ theme: richTheme }}>
          <ContentEditor />
        </Provider>
      </div>
    </div>
  )
}`,
    language: "tsx",
    title: "Component-Level Theming",
    description:
      "Apply different themes to different editor instances in the same application",
    highlightLines: [
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      42, 43, 44, 45, 46, 47, 48, 49,
    ],
  },
];

export default THEMING_CODES;
