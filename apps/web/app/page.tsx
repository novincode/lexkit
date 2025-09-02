'use client'
import { DefaultTemplate, EditorProvider, boldExtension, italicExtension, imageExtension } from "@repo/editor"

function EditorContent() {
  return (
    <>
      <DefaultTemplate />
    </>
  );
}

export default function Page() {
  const configuredBold = boldExtension.configure({
    nodeStyle: {
      backgroundColor: "#111111"
    },
    nodeClassName: "test-class",
    
  });

  const extensions = [
    configuredBold,
    italicExtension,
    imageExtension.configure({ showInToolbar: true })
  ];

  const editorConfig = {
    theme: {
      text: {
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
