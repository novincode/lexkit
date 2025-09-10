"use client"

import React from "react"
import Link from "next/link"
import { Github, ExternalLink, Menu, X } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { ThemeToggle } from "./theme-toggle"
import { useState, useEffect } from "react"
import { cn } from "@repo/ui/lib/utils"
import { usePathname } from "next/navigation"

interface TopNavigationProps {
  className?: string
  children?: React.ReactNode
  beforeChildren?: React.ReactNode
  afterChildren?: React.ReactNode
  showMobileMenu?: boolean
}

// Navigation items configuration
const navigationItems = [
  {
    label: "Documentation",
    href: "/docs",
    activePaths: ["/docs"],
    external: false
  },
  {
    label: "Demo",
    href: "/demo",
    activePaths: ["/demo"],
    external: false
  },
  {
    label: "Templates",
    href: "/templates",
    activePaths: ["/templates"],
    external: false
  },
  {
    label: "Playground",
    href: "https://stackblitz.com/edit/vitejs-vite-bpg2kpze",
    activePaths: [],
    external: true
  }
]

export function TopNavigation({
  className,
  children,
  beforeChildren,
  afterChildren,
  showMobileMenu = true
}: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Helper function to check if a navigation item is active
  const isActive = (item: typeof navigationItems[0]) => {
    if (!isClient || item.external) return false

    // Check if current path matches any of the active paths
    return item.activePaths.some(activePath => {
      if (activePath === "/docs") {
        // Special case for docs - any path starting with /docs should be active
        return pathname.startsWith("/docs")
      }
      return pathname === activePath || pathname.startsWith(activePath + "/")
    })
  }

  return (
    <header className={cn(" z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="px-4 flex h-16 items-center">
        {/* Before children (mobile) */}
        {beforeChildren && (
          <div className="md:hidden mr-4">
            {beforeChildren}
          </div>
        )}

        {/* Logo */}
        <div className="mr-6 flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-extralight text-xl">L</span>
            </div>
            <span className="font-bold text-xl">LexKit</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-md tracking-wide font-medium">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              className={cn(
                "flex items-center gap-1 transition-colors",
                isClient && isActive(item)
                  ? "text-primary underline underline-offset-4"
                  : "text-foreground/60 hover:text-foreground font-light"
              )}
            >
              {item.label}
              {item.external && <ExternalLink className="h-3 w-3" />}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="lg" asChild className="hidden md:flex">
            <Link
              href="https://github.com/novincode/lexkit"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </Button>

          {/* Mobile menu button */}
          {showMobileMenu && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden mr-2 h-auto size-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="px-4 py-4 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  isClient && isActive(item)
                    ? "text-primary font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                {item.external && <ExternalLink className="h-3 w-3" />}
              </Link>
            ))}
            <Link
              href="https://github.com/novincode/lexkit"
              target="_blank"
              className="flex items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </Link>

            {/* After children (mobile) */}
            {afterChildren && (
              <div className="md:hidden pt-2 border-t">
                {afterChildren}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
