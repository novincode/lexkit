"use client"

// Tailwind-Based Example - Themed Editor with Pure Tailwind CSS
// This example shows how to style LexKit with Tailwind CSS classes only
import React from "react"
import { Button } from "@repo/ui/components/button"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, linkExtension, historyExtension, RichText } from "@lexkit/editor"
import { LexKitTheme } from "@lexkit/editor/core"

// 1. Define your custom theme with type safety
const tailwindTheme: LexKitTheme = {
  // Toolbar styles
  toolbar: {
    button: 'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
    buttonActive: 'bg-blue-600 text-white',
    buttonDisabled: 'bg-gray-800 text-gray-500 cursor-not-allowed',
    group: 'flex gap-1'
  },

  // Editor content styles
  container: 'p-4 border border-gray-700 rounded-lg overflow-hidden bg-gray-800',
  wrapper: 'min-h-[300px]',

  // Node styles for Lexical
  paragraph: 'mb-4 text-gray-100 leading-relaxed',
  heading: {
    h1: 'text-4xl font-bold mb-6 text-white',
    h2: 'text-3xl font-bold mb-4 text-white',
    h3: 'text-2xl font-semibold mb-3 text-white',
    h4: 'text-xl font-semibold mb-2 text-white',
    h5: 'text-lg font-medium mb-2 text-white',
    h6: 'text-base font-medium mb-2 text-white',
  },
  list: {
    ul: 'list-disc list-inside mb-4 space-y-1 text-gray-100',
    ol: 'list-decimal list-inside mb-4 space-y-1 text-gray-100',
    listitem: 'text-gray-100',
    nested: {
      list: 'ml-6',
      listitem: 'text-gray-100',
    },
  },
  quote: 'border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-4',
  code: 'bg-gray-900 px-2 py-1 rounded text-sm font-mono text-green-400',
  link: 'text-blue-400 hover:text-blue-300 underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-gray-900 px-1 py-0.5 rounded text-sm font-mono text-green-400',
  },
  image: 'max-w-full h-auto rounded-lg shadow-lg',
  horizontalRule: 'border-t border-gray-600 my-6',
  table: 'w-full border-collapse border border-gray-600 mb-4',
  tableRow: 'border-b border-gray-600',
  tableCell: 'border border-gray-600 px-4 py-2 text-gray-100',
  tableCellHeader: 'border border-gray-600 px-4 py-2 bg-gray-700 text-white font-semibold',


}

// 2. Define your extensions (as const for type safety)
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  linkExtension.configure({ pasteListener: { insert: true, replace: true } }),
  historyExtension
] as const

// 3. Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Tailwind Toolbar Component
function TailwindToolbar() {
  const { commands, activeStates } = useEditor()

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-900 border-b border-gray-700">
      {/* Text Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => commands.toggleBold()}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.bold
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Bold (Ctrl+B)"
        >
          Bold
        </button>

        <button
          onClick={() => commands.toggleItalic()}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.italic
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Italic (Ctrl+I)"
        >
          Italic
        </button>

        <button
          onClick={() => commands.toggleUnderline()}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.underline
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Underline (Ctrl+U)"
        >
          Underline
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1">
        <button
          onClick={() => commands.toggleUnorderedList()}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.unorderedList
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          onClick={() => commands.toggleOrderedList()}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.orderedList
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      {/* Links */}
      <div className="flex gap-1">
        <button
          onClick={() => {
            const url = prompt('Enter link URL:')
            const text = prompt('Enter link text:')
            if (url && text) {
              commands.insertLink(url, text)
            }
          }}
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
          title="Insert Link"
        >
          🔗 Link
        </button>
      </div>

      {/* History */}
      <div className="flex gap-1">
        <button
          onClick={() => commands.undo()}
          disabled={!activeStates.canUndo}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.canUndo
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>

        <button
          onClick={() => commands.redo()}
          disabled={!activeStates.canRedo}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.canRedo
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
      </div>
    </div>
  )
}

// Tailwind Editor Component
function TailwindEditor() {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
      <TailwindToolbar />
      <RichText
        placeholder="Start writing with Tailwind-styled editor..."
        classNames={{
            contentEditable: 'p-4 min-h-[300px] relative  outline-none text-base leading-relaxed text-gray-100 bg-gray-800'
        }}
        styles={{
            placeholder:{
                left:16,
                top:16
            }
        }}
      />
    </div>
  )
}

// Internal component that uses the editor
function TailwindBasedExampleInner() {
  return (
    <div className="space-y-4">
      <TailwindEditor />
      <p className="text-sm text-gray-400 text-center">
        This editor is styled entirely with Tailwind CSS classes — no custom CSS files needed!
      </p>
    </div>
  )
}

export function TailwindBasedExample() {
  return (
    <Provider 
      extensions={extensions}
      config={{ theme: tailwindTheme }}
    >
      <TailwindBasedExampleInner />
    </Provider>
  )
}
