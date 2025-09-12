"use client"

// Dark Mode Example - Shows dynamic theme switching
// This example demonstrates how to switch between light and dark themes dynamically

import React, { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { createEditorSystem, boldExtension, italicExtension, underlineExtension, listExtension, linkExtension, historyExtension, RichText } from "@lexkit/editor"
import { LexKitTheme } from "@lexkit/editor"

// Light theme
const lightTheme: LexKitTheme = {
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
  list: {
    ul: 'list-disc list-inside mb-4 space-y-1 text-gray-800',
    ol: 'list-decimal list-inside mb-4 space-y-1 text-gray-800',
    listitem: 'text-gray-800',
  },
  quote: 'border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4',
  link: 'text-blue-600 hover:text-blue-800 underline',

  toolbar: {
    button: 'px-3 py-2 text-sm font-medium rounded-md transition-colors bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
    buttonActive: 'bg-blue-600 text-white border-blue-600',
    buttonDisabled: 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200',
    group: 'flex gap-2'
  },
  container: 'border border-gray-200 rounded-lg overflow-hidden bg-white',
  wrapper: 'min-h-[300px] p-4',
  richText: {
    contentEditable: 'outline-none min-h-[200px] text-gray-800',
    placeholder: 'text-gray-400 italic'
  },
}

// Dark theme
const darkTheme: LexKitTheme = {
  paragraph: 'mb-4 text-gray-100 leading-relaxed',
  heading: {
    h1: 'text-3xl font-bold mb-6 text-white',
    h2: 'text-2xl font-bold mb-4 text-white',
    h3: 'text-xl font-semibold mb-3 text-white',
  },
  text: {
    bold: 'font-bold text-white',
    italic: 'italic text-gray-300',
    underline: 'underline decoration-blue-400',
  },
  list: {
    ul: 'list-disc list-inside mb-4 space-y-1 text-gray-100',
    ol: 'list-decimal list-inside mb-4 space-y-1 text-gray-100',
    listitem: 'text-gray-100',
  },
  quote: 'border-l-4 border-blue-400 pl-4 italic text-gray-300 mb-4',
  link: 'text-blue-400 hover:text-blue-300 underline',

  toolbar: {
    button: 'px-3 py-2 text-sm font-medium rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600',
    buttonActive: 'bg-blue-600 text-white border-blue-600',
    buttonDisabled: 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600',
    group: 'flex gap-2'
  },
  container: 'border border-gray-600 rounded-lg overflow-hidden bg-gray-800',
  wrapper: 'min-h-[300px] p-4',
  richText: {
    contentEditable: 'outline-none min-h-[200px] text-gray-100',
    placeholder: 'text-gray-500 italic'
  },
}

// Define extensions as const for type safety
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  listExtension,
  linkExtension.configure({ pasteListener: { insert: true, replace: true } }),
  historyExtension
] as const

// Create typed editor system
const { Provider, useEditor } = createEditorSystem<typeof extensions>()

// Dynamic Toolbar Component
function DynamicToolbar({ isDark }: { isDark: boolean }) {
  const { commands, activeStates } = useEditor()

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Text Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => commands.toggleBold()}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeStates.bold
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
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
              : isDark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
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
              : isDark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
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
              : isDark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
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
              : isDark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
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
            const url = prompt('Enter URL:')
            const text = prompt('Enter link text:')
            if (url && text) {
              commands.insertLink(url, text)
            }
          }}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            isDark
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
          }`}
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
            !activeStates.canUndo
              ? isDark
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-600'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
              : isDark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
          }`}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>

        <button
          onClick={() => commands.redo()}
          disabled={!activeStates.canRedo}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            !activeStates.canRedo
              ? isDark
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-600'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
              : isDark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
          }`}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
      </div>
    </div>
  )
}

// Dynamic Editor Component
function DynamicEditor({ isDark }: { isDark: boolean }) {
  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${
      isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <DynamicToolbar isDark={isDark} />
      <RichText
        placeholder={`Start writing in ${isDark ? 'dark' : 'light'} mode! Try toggling the theme.`}
        classNames={{
          contentEditable: `p-4 min-h-[300px] relative outline-none text-base leading-relaxed ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`,
          placeholder: isDark ? 'text-gray-500' : 'text-gray-400'
        }}
      />
    </div>
  )
}

// Main Dark Mode Example Component
function DarkModeExampleInner() {
  const [isDark, setIsDark] = useState(false)
  const currentTheme = isDark ? darkTheme : lightTheme

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Current Theme: {isDark ? 'Dark' : 'Light'}
        </h3>
        <Button
          onClick={() => setIsDark(!isDark)}
          variant={isDark ? "default" : "outline"}
          size="sm"
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Button>
      </div>

      <Provider extensions={extensions} config={{ theme: currentTheme }}>
        <DynamicEditor isDark={isDark} />
      </Provider>

      <p className="text-sm text-muted-foreground text-center">
        Toggle between light and dark themes to see dynamic theming in action!
      </p>
    </div>
  )
}

export function DarkModeExample() {
  return <DarkModeExampleInner />
}
