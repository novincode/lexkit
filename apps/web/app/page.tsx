'use client'
import { DefaultTemplate, EditorProvider, boldExtension, italicExtension, imageExtension } from "@repo/editor"
import { useEditor } from "@repo/editor/core/useEditor";
import { Button } from "@repo/ui/components/button";

function EditorContent() {
  const editor = useEditor();

  return (
    <>
      <DefaultTemplate />
      <Button variant={'ghost'}
      onClick={() => {
        editor.commands.undo()
      }}
      >
        UNDO
      </Button>
    </>
  );
}

export default function Page() {
  const configuredBold = boldExtension.configure({
    nodeStyle: {
      backgroundColor: "yellow"
    },
    nodeClassName: "test-class"
  });

  const extensions = [
    configuredBold,
    italicExtension,
    imageExtension.configure({ showInToolbar: true })
  ];

  const editorConfig = {
    theme: {
      text: {
        bold: 'font-bold text-blue-500',
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
