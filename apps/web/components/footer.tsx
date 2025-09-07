import Link from "next/link"
import { Coffee, Heart, Github } from "lucide-react"
import { Button } from "@repo/ui/components/button"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">L</span>
              </div>
              <span className="font-semibold">LexKit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A headless, extensible rich text editor built on Lexical.
            </p>
          </div>

          {/* Documentation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Documentation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/docs/introduction" className="hover:text-foreground transition-colors">
                  Introduction
                </Link>
              </li>
              <li>
                <Link href="/docs/installation" className="hover:text-foreground transition-colors">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/docs/quick-start" className="hover:text-foreground transition-colors">
                  Quick Start
                </Link>
              </li>
              <li>
                <Link href="/docs/extensions" className="hover:text-foreground transition-colors">
                  Extensions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/demo" className="hover:text-foreground transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link 
                  href="https://stackblitz.com/edit/vitejs-vite-bpg2kpze" 
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  Playground
                </Link>
              </li>
              <li>
                <Link 
                  href="https://github.com/novincode/lexkit" 
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support the Project</h4>
            <div className="space-y-3">
              <Button asChild size="sm" className="w-full">
                <Link 
                  href="https://buymeacoffee.com/lexkit" 
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Coffee className="h-4 w-4" />
                  Buy me a coffee
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link 
                  href="https://github.com/novincode/lexkit" 
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 LexKit. Built with{" "}
              <Heart className="inline h-3 w-3 text-red-500" />{" "}
              by a solo dev from Iran 😭😊
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link href="https://github.com/novincode/lexkit" target="_blank" className="hover:text-foreground transition-colors">
                GitHub
              </Link>
              <Link href="https://discord.gg/hAvRFC9Y" target="_blank" className="hover:text-foreground transition-colors">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
