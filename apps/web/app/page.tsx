'use client'
import { DefaultTemplate, BoldExtension } from "@repo/editor"

export default function Page() {
  const boldExt = new BoldExtension();
  return (
    <div>
      <DefaultTemplate extensions={[boldExt]} />
    </div>
  )
}
