'use client'
import { DefaultTemplate, EditorProvider, boldExtension } from "@repo/editor"
import { useEditor } from "@repo/editor/core/useEditor";
import { Button } from "@repo/ui/components/button";

export default function Page() {
  const configuredBold = boldExtension.configure({
    nodeStyle: {
      backgroundColor: "yellow"
    },
    nodeClassName: "test-class"
  });
  const editor = useEditor()

  return (
    <EditorProvider extensions={[configuredBold]}>
      <DefaultTemplate />
      <Button variant={'ghost'}
      onClick={() => {
        editor.commands.undo()
      }}
      >
        UNDO
      </Button>
    </EditorProvider>
  )
}
