"use client"

import React from "react"
import Link from "next/link"
import { Github, ExternalLink, Menu, X } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"
import { cn } from "@repo/ui/lib/utils"

interface TopNavigationProps {
  className?: string
  children?: React.ReactNode
  beforeChildren?: React.ReactNode
  afterChildren?: React.ReactNode
  showMobileMenu?: boolean
}

export function TopNavigation({
  className,
  children,
  beforeChildren,
  afterChildren,
  showMobileMenu = true
}: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={cn(" z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="px-4 flex h-16 items-center">
        {/* Before children (mobile) */}
        {beforeChildren && (
          <div className="md:hidden mr-2">
            {beforeChildren}
          </div>
        )}



        {/* Before children (desktop) */}
        {beforeChildren && (
          <div className="hidden md:flex mr-2">
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

          {/* Mobile menu button */}
          {showMobileMenu && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          )}
          <ThemeToggle />

          {/* After children (desktop) */}
          {afterChildren && (
            <div className="hidden md:flex ml-2">
              {afterChildren}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="px-4 py-4 space-y-3">
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
