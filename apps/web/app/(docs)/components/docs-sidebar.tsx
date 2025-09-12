"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Github, ExternalLink } from "lucide-react"
import { Badge } from "@repo/ui/components/badge"
import { ScrollArea } from "@repo/ui/components/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@repo/ui/components/sheet"
import { docsConfig } from "../lib/docs-config"
import { cn } from "@repo/ui/lib/utils"
import { useEffect } from "react"

interface DocsSidebarProps {
  className?: string
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function DocsSidebar({
  className,
  isMobile = false,
  isOpen = false,
  onClose
}: DocsSidebarProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      const activeLink = document.querySelector('[data-active="true"]') as HTMLElement
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  const SidebarContent = () => (
    <div className="flex flex-col max-h-full  flex-auto">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
        <BookOpen className="h-5 w-5" />
        <span className="font-semibold">LexKit Docs</span>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-hidden min-h-0">
        <ScrollArea className="h-full">
          <nav className="p-4 space-y-6">
            {docsConfig.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                            isActive
                              ? "bg-secondary border border-border font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                          onClick={isMobile ? onClose : undefined}
                          data-active={isActive ? "true" : "false"}
                        >
                          <span>{item.title}</span>
                          {item.isNew && (
                            <Badge variant="secondary" className="h-5 text-xs">
                              New
                            </Badge>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Footer - Sticky */}
      <div className="flex-shrink-0 border-t bg-background">
        <div className="p-4 space-y-2">
          <Link
            href="https://github.com/novincode/lexkit"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={isMobile ? onClose : undefined}
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3 ml-auto" />
          </Link>
          <Link
            href="https://lexkit.codeideal.com/demo"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={isMobile ? onClose : undefined}
          >
            <span>Live Demo</span>
            <ExternalLink className="h-3 w-3 ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0 sm:w-96 flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Documentation Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <SidebarContent />
    </div>
  )
}
