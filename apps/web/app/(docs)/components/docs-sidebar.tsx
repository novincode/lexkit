"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Github, ExternalLink } from "lucide-react"
import { Badge } from "@repo/ui/components/badge"
import { ScrollArea } from "@repo/ui/components/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@repo/ui/components/sheet"
import { docsConfig } from "../lib/docs-config"
import { cn } from "@repo/ui/lib/utils"

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
     

      {/* Navigation */}
      <ScrollArea className="flex-1">
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
                            ? "bg-secondary border border-border  font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        onClick={isMobile ? onClose : undefined}
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

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
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
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0 sm:w-96">
          <SheetHeader className="sr-only">
            <SheetTitle>Documentation Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <SidebarContent />
    </div>
  )
}
