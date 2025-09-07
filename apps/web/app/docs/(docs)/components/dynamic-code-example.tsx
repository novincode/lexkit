"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs"
import { cn } from "@repo/ui/lib/utils"

interface DynamicCodeExampleProps {
  exampleName: string
  title?: string
  description?: string
  preview: React.ReactNode
  className?: string
}

interface CodeData {
  component?: string
  css?: string
}

export function DynamicCodeExample({
  exampleName,
  title,
  description,
  preview,
  className
}: DynamicCodeExampleProps) {
  const [codeContent, setCodeContent] = useState<CodeData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCode() {
      try {
        setLoading(true)
        const response = await fetch(`/api/examples/${exampleName}`)
        const result = await response.json()

        if (result.success) {
          setCodeContent(result.data)
        } else {
          setError(result.error || 'Failed to load code')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load code')
      } finally {
        setLoading(false)
      }
    }

    fetchCode()
  }, [exampleName])

  const tabs = []

  // Preview tab
  tabs.push({
    id: "preview",
    label: "Preview",
    content: (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-background p-8">
        {preview}
      </div>
    )
  })

  // Component code tab
  if (codeContent.component) {
    tabs.push({
      id: "component",
      label: "Code",
      content: (
        <div className="rounded-lg border bg-muted p-4 overflow-x-auto">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading code...</div>
          ) : error ? (
            <div className="text-sm text-red-500">Error: {error}</div>
          ) : (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: codeContent.component }}
            />
          )}
        </div>
      )
    })
  }

  // CSS tab
  if (codeContent.css) {
    tabs.push({
      id: "css",
      label: "CSS",
      content: (
        <div className="rounded-lg border bg-muted p-4 overflow-x-auto">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading CSS...</div>
          ) : error ? (
            <div className="text-sm text-red-500">Error: {error}</div>
          ) : (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: codeContent.css }}
            />
          )}
        </div>
      )
    })
  }

  return (
    <div className={cn("not-prose my-6", className)}>
      {(title || exampleName) && (
        <h4 className="mb-2 text-lg font-semibold">
          {title || exampleName.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
      )}

      {description && (
        <p className="mb-4 text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-auto overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
