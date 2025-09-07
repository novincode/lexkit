"use client"

import { useEffect, useState } from "react"
import { Button } from "@repo/ui/components/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@repo/ui/lib/utils"
import { createHighlighter, type Highlighter } from 'shiki'

interface CodeBlockProps {
  children: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export function CodeBlock({
  children,
  language = "tsx",
  title,
  showLineNumbers = false,
  highlightLines = [],
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState<string>("")
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const initHighlighter = async () => {
      try {
        const hl = await createHighlighter({
          themes: ['github-dark', 'github-light'],
          langs: [
            'javascript', 'typescript', 'tsx', 'jsx', 'json', 'css', 'html',
            'bash', 'shell', 'python', 'java', 'cpp', 'c', 'go', 'rust',
            'php', 'ruby', 'swift', 'kotlin', 'dart', 'scala', 'sql',
            'yaml', 'xml', 'markdown', 'dockerfile', 'makefile'
          ]
        })
        setHighlighter(hl)
      } catch (error) {
        console.error('Failed to initialize syntax highlighter:', error)
        // Fallback to plain text
        setHighlightedCode(`<pre><code>${children.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
      }
    }

    initHighlighter()
  }, [])

  useEffect(() => {
    if (!highlighter) return

    try {
      const code = children.trim()
      const html = highlighter.codeToHtml(code, {
        lang: language,
        theme: 'github-dark',
        transformers: [
          {
            line(node, line) {
              if (highlightLines.includes(line)) {
                node.properties.class = 'highlighted-line'
              }
            }
          }
        ]
      })
      setHighlightedCode(html)
    } catch (error) {
      console.error('Failed to highlight code:', error)
      // Fallback to plain text
      setHighlightedCode(`<pre><code>${children.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
    }
  }, [children, language, highlighter, highlightLines])

  return (
    <div className={cn("relative group not-prose", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 text-sm font-medium bg-muted border border-b-0 rounded-t-lg">
          <span>{title}</span>
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      )}

      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-2 top-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>

        <div
          className={cn(
            "overflow-x-auto rounded-lg bg-muted p-4 text-sm",
            title && "rounded-t-none",
            showLineNumbers && "pl-12"
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  )
}

// For inline code
export function InlineCode({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <code className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className
    )}>
      {children}
    </code>
  )
}
