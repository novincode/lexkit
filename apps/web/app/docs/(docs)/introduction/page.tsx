import React from "react"
import { DynamicCodeExample } from "../components/dynamic-code-example"
import { BasicEditorExample } from "./examples/BasicEditorExample"
import { AdvancedFeaturesExample } from "./examples/AdvancedFeaturesExample"
import { ThemedEditorExample } from "./examples/ThemedEditorExample"

export default function IntroductionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Introduction to LexKit</h1>
        <p className="text-lg text-muted-foreground mb-6">
          LexKit is a modern, type-safe rich text editor built on top of Lexical.
          It provides a flexible extension system and seamless integration with React.
        </p>
      </div>

      <DynamicCodeExample
        exampleName="BasicEditorExample"
        preview={<BasicEditorExample />}
      />

      <DynamicCodeExample
        exampleName="AdvancedFeaturesExample"
        preview={<AdvancedFeaturesExample />}
      />

      <DynamicCodeExample
        exampleName="ThemedEditorExample"
        preview={<ThemedEditorExample />}
      />
    </div>
  )
}
