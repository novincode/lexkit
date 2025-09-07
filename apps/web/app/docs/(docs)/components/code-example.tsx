"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs"
import { cn } from "@repo/ui/lib/utils"

interface CodeExampleProps {
  title?: string
  preview: React.ReactNode
  code: React.ReactNode
  className?: string
}

export function CodeExample({
  title,
  preview,
  code,
  className
}: CodeExampleProps) {
  return (
    <div className={cn("not-prose my-6", className)}>
      {title && (
        <h4 className="mb-4 text-lg font-semibold">{title}</h4>
      )}
      
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview" className="text-sm">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="text-sm">
            Code
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="mt-0">
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-background p-8">
            {preview}
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="mt-0">
          <div className="rounded-t-none border-t-0">
            {code}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
