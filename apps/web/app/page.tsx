import { Editor, BoldExtension } from "@repo/editor"

export default function Page() {
  return (
    <div>
 
      <Editor extensions={[BoldExtension]} />
    </div>
  )
}
