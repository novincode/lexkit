import React from 'react';
import { LexKitTheme } from "@lexkit/editor";

export const shadcnTheme: LexKitTheme = {
  // Toolbar styles - using SHADCN classes
  toolbar: {
    group: 'flex items-center gap-1 p-2 border-b bg-background'
  },

  // Editor content styles (Lexical EditorThemeClasses)
  editor: 'min-h-[400px] p-4 focus:outline-none',
  contentEditable: 'outline-none text-xl leading-relaxed text-foreground font-system',

  // Placeholder styling
  placeholder: 'text-xl leading-relaxed select-none text-muted-foreground',

  // Node styles for Lexical - using Tailwind classes
  paragraph: 'mb-3 leading-relaxed text-foreground',
  heading: {
    h1: 'text-4xl font-bold mb-6 mt-8 first:mt-0 text-foreground',
    h2: 'text-3xl font-semibold mb-4 mt-6 text-foreground',
    h3: 'text-2xl font-semibold mb-3 mt-5 text-foreground',
    h4: 'text-xl font-semibold mb-2 mt-4 text-foreground',
    h5: 'text-lg font-semibold mb-2 mt-3 text-foreground',
    h6: 'text-base font-semibold mb-2 mt-3 text-foreground',
  },
  list: {
    ul: 'list-disc list-inside mb-4 space-y-1',
    ol: 'list-decimal list-inside mb-4 space-y-1',
    listitem: 'leading-relaxed text-foreground',
  },
  quote: 'border-l-4 border-border pl-4 italic text-muted-foreground mb-4',
  code: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono block w-full',
  codeHighlight: {
    atrule: 'text-purple-600',
    attr: 'text-blue-600',
    boolean: 'text-red-600',
    builtin: 'text-purple-600',
    cdata: 'text-gray-600',
    char: 'text-green-600',
    class: 'text-blue-600',
    'class-name': 'text-blue-600',
    comment: 'text-gray-600',
    constant: 'text-red-600',
    deleted: 'text-red-600',
    doctype: 'text-gray-600',
    entity: 'text-yellow-600',
    function: 'text-purple-600',
    important: 'text-red-600',
    inserted: 'text-green-600',
    keyword: 'text-purple-600',
    namespace: 'text-blue-600',
    number: 'text-red-600',
    operator: 'text-gray-800',
    prolog: 'text-gray-600',
    property: 'text-blue-600',
    punctuation: 'text-gray-800',
    regex: 'text-green-600',
    selector: 'text-blue-600',
    string: 'text-green-600',
    symbol: 'text-yellow-600',
    tag: 'text-red-600',
    url: 'text-blue-600',
    variable: 'text-yellow-600',
  },
  link: 'text-primary underline underline-offset-2 hover:text-primary/80 transition-colors',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
  },
  image: 'max-w-full h-auto rounded-lg shadow-sm',
  hr: 'border-t border-border my-8',
  table: 'w-full border-collapse border border-border rounded-lg overflow-hidden mb-4',
  tableRow: '',
  tableCell: 'border border-border p-3 text-left text-foreground',
  tableCellHeader: 'border border-border p-3 text-left font-semibold bg-muted text-foreground',

  // Pre/code block styling
  pre: 'bg-muted text-foreground p-4 rounded-lg overflow-x-auto my-4 border font-mono text-sm w-full block',
  preCode: 'bg-transparent p-0 rounded-none text-sm',

  // HTML Embed Extension - accessed via this.theme.htmlEmbed in extensions
  htmlEmbed: {
    container: 'border border-border rounded-lg overflow-hidden bg-card shadow-sm',
    preview: 'p-4',
    editor: 'p-4 border-t border-border bg-muted/50',
    textarea: 'w-full h-32 p-3 bg-background border border-input rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring',
    toggle: 'mt-3 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors',
    content: 'prose prose-sm max-w-none dark:prose-invert',
    styles: {
      toggle: {
        marginTop: '12px'
      },
    }
  },

  // Draggable Block Extension - accessed via this.theme.draggable in extensions
  draggable: {
    handle: 'w-6 h-6 p-0 flex items-center justify-center bg-background border border-border rounded-md text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-grab hover:scale-110 active:scale-95 active:rotate-12 active:cursor-grabbing backdrop-blur-sm',
    handleActive: 'bg-accent border-ring text-accent-foreground shadow-md scale-105 rotate-12 cursor-grabbing',
    upButton: 'w-6 h-6 bg-background border border-border rounded text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm',
    downButton: 'w-6 h-6 bg-background border border-border rounded text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm',
    buttonStack: 'absolute z-[9999] flex flex-col gap-1.5 items-center pointer-events-auto  animate-in fade-in-0 slide-in-from-top-2 duration-300 -ml-10',
    blockDragging: 'opacity-60 rotate-2 scale-98 shadow-2xl rounded-lg transition-all duration-300 ease-out',
    dropIndicator: 'bg-gradient-to-r from-primary to-primary/80 shadow-2xl animate-pulse backdrop-blur-sm'
  },

  // Floating Toolbar Extension - accessed via this.theme.floatingToolbar in extensions
  floatingToolbar: {
    container: 'flex items-center gap-1 p-2 bg-background border border-border rounded-lg shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-200',
    button: 'w-8 h-8 bg-background border border-border rounded text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    buttonActive: 'bg-accent border-ring text-accent-foreground scale-105',
    styles: {
      container: {
        zIndex: 50,
        pointerEvents: 'auto'
      },
    }
  },

};
