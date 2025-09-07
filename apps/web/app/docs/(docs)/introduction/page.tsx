import React from "react"
import { DynamicCodeExample } from "../components/dynamic-code-example"
import { BasicEditorExample } from "./examples/BasicEditorExample"
import { AdvancedFeaturesExample } from "./examples/AdvancedFeaturesExample"
import { ThemedEditorExample } from "./examples/ThemedEditorExample"
import { Badge } from "@repo/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { CheckCircle, Zap, Palette, Code2 } from "lucide-react"

export default function IntroductionPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            LexKit
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A modern, type-safe rich text editor built on top of Lexical.
          Experience seamless integration with React and powerful extension capabilities.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Type-Safe
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            Extensible
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Palette className="h-3 w-3 mr-1" />
            Themeable
          </Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Lightning Fast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Built on Lexical's high-performance architecture with optimized rendering
              and minimal bundle size impact.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Developer Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Full TypeScript support with intelligent autocomplete, comprehensive
              documentation, and easy-to-use APIs.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Highly Customizable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Extensive theming system with CSS-in-JS support, custom extensions,
              and complete visual control.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Choose from our pre-built examples or create your own custom editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Quick Setup</h4>
              <code className="block bg-muted p-2 rounded text-xs">
                npm install @lexkit/editor
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Basic Usage</h4>
              <code className="block bg-muted p-2 rounded text-xs">
                import {"{ createEditorSystem }"} from '@lexkit/editor'
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Interactive Examples</h2>
          <p className="text-muted-foreground">
            Explore our examples below. Each example includes live preview, source code, and styling.
          </p>
        </div>

        <DynamicCodeExample
          exampleName="BasicEditorExample"
          title="Basic Editor"
          description="Start with essential formatting features"
          preview={<BasicEditorExample />}
        />

        <DynamicCodeExample
          exampleName="AdvancedFeaturesExample"
          title="Advanced Features"
          description="Comprehensive editing capabilities with custom extensions"
          preview={<AdvancedFeaturesExample />}
        />

        <DynamicCodeExample
          exampleName="ThemedEditorExample"
          title="Themed Editor"
          description="Complete theming control with dark mode support"
          preview={<ThemedEditorExample />}
        />
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Ready to Build?</h3>
          <p className="text-muted-foreground mb-4">
            Start creating amazing rich text experiences with LexKit
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline">Documentation</Badge>
            <Badge variant="outline">API Reference</Badge>
            <Badge variant="outline">GitHub</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
