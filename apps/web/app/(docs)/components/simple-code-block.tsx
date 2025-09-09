"use client"

import { useState } from "react"
import { Button } from "@repo/ui/components/button"
import { ScrollArea } from "@repo/ui/components/scroll-area"
import { Copy, Check } from "lucide-react"
import { cn } from "@repo/ui/lib/utils"

interface SimpleCodeBlockProps {
  html: string
  raw: string
  title?: string
  className?: string
  height?: string
  showCopy?: boolean
}

// CopyButton component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      onClick={handleCopy}
      size="sm"
      variant="outline"
      className="absolute top-2 right-2 z-10 !border-foreground/20 !border-2 bg-background/95 backdrop-blur-sm"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </Button>
  )
}

export function SimpleCodeBlock({
  html,
  raw,
  title,
  className,
  height = "h-64",
  showCopy = true
}: SimpleCodeBlockProps) {
  return (
    <div className={cn("not-prose my-4 max-w-full", className)}>
      {title && (
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
          {title}
        </h4>
      )}

      <ScrollArea className={cn("relative overflow-hidden rounded-lg ", height)}>
        {showCopy && <CopyButton text={raw} />}
        <div
          className="w-full"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </ScrollArea>
    </div>
  )
}
