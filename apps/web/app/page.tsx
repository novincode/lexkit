'use client'
import { DefaultTemplate, createEditorSystem, boldExtension, italicExtension, imageExtension, listExtension, defaultTheme, mergeTheme } from "@repo/editor"

export default function Page() {
  const extensions = [
    boldExtension,
    italicExtension,
    listExtension,
    imageExtension.configure({ showInToolbar: true })
  ];

  const editorConfig = {
    theme: mergeTheme({
      text: {
        bold: 'font-bold text-red-500',
        italic: 'italic',
      },
    }),
  };

  // Create typed system
  const { Provider: EditorProvider, useEditor: useTypedEditor } = createEditorSystem<typeof extensions>();

  
  function EditorContent() {

    return (
      <>
        <DefaultTemplate useEditor={useTypedEditor} />
      </>
    );
  }

  return (
    <EditorProvider extensions={extensions} config={editorConfig}>
      <EditorContent />
    </EditorProvider>
  )
}
