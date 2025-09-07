"use client"

import Link from "next/link"
import { Github, ExternalLink, Menu } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"
import { cn } from "@repo/ui/lib/utils"
import { SidebarTrigger } from "@repo/ui/components/sidebar"

export function TopNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className=" top-0 z-50 w-full border-b bg-background">
      <div className="px-4 flex h-16 items-center">
        <SidebarTrigger className="md:hidden mr-2" />
        {/* Logo */}
        <div className="mr-6 flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-xl">LexKit</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/docs"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/demo"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/templates"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Templates
          </Link>
          <Link
            href="https://stackblitz.com/edit/vitejs-vite-bpg2kpze"
            target="_blank"
            className="text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1"
          >
            Playground
            <ExternalLink className="h-3 w-3" />
          </Link>
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="hidden md:flex">
            <Link 
              href="https://github.com/novincode/lexkit" 
              target="_blank"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </Button>
          
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-3">
            <Link
              href="/docs"
              className="block text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/demo"
              className="block text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="/templates"
              className="block text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              href="https://stackblitz.com/edit/vitejs-vite-bpg2kpze"
              target="_blank"
              className="block text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Playground
            </Link>
            <Link
              href="https://github.com/novincode/lexkit"
              target="_blank"
              className="block text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
