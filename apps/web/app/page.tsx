'use client'
import { DefaultTemplate, EditorProvider, boldExtension, italicExtension, imageExtension, listExtension } from "@repo/editor"

const defaultTheme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-gray-100 px-1 rounded font-mono text-sm',
  },
  list: {
    ul: 'list-disc pl-6',
    ol: 'list-decimal pl-6',
    listitem: 'mb-1',
    nested: {
      listitem: 'pl-4',
    },
  },
  paragraph: 'mb-4',
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
    h4: 'text-lg font-bold mb-2',
    h5: 'text-base font-bold mb-1',
    h6: 'text-sm font-bold mb-1',
  },
  quote: 'border-l-4 border-gray-300 pl-4 italic',
  code: 'bg-gray-100 px-1 rounded font-mono text-sm',
  link: 'text-blue-600 underline',
  image: 'max-w-full h-auto rounded shadow',
};

function EditorContent() {
  return (
    <>
      <DefaultTemplate />
    </>
  );
}

export default function Page() {
  const configuredBold = boldExtension.configure({
    // Removed nodeStyle and nodeClassName - use theme instead
  });

  const extensions = [
    configuredBold,
    italicExtension,
    listExtension.configure({
      nodeStyle: {
        background:'black'
      }
    }),
    imageExtension.configure({ showInToolbar: true })
  ];

  const editorConfig = {
    theme: {
      ...defaultTheme,
      text: {
        ...defaultTheme.text,
        bold: 'font-bold text-red-500',
        italic: 'italic',
      },
    },
  };

  return (
    <EditorProvider extensions={extensions} config={editorConfig}>
      <EditorContent />
    </EditorProvider>
  )
}
