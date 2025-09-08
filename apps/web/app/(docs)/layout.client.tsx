'use client'
import { TopNavigation } from "@/components/top-navigation"
import { Button } from "@repo/ui/components/button"
import { Sidebar } from "lucide-react"
import { useState } from "react"
import "./docs.css"
import "./styles/prism.css"
import { Footer } from "@/components/footer"
import { DocsSidebar } from "./components/docs-sidebar"

interface DocsLayoutClientProps {
  children: React.ReactNode
}

export function DocsLayoutClient({ children }: DocsLayoutClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation
        className="top-0 sticky"
        beforeChildren={
          <Button
            variant="ghost"
            className="lg:hidden size-10"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open documentation navigation"
          >
            <Sidebar className="size-6" />
          </Button>
        }
      />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <DocsSidebar className="hidden lg:flex sticky w-64 border-r top-16 bottom-0 max-h-[calc(100vh-64px)] overflow-y-auto" />

        {/* Mobile Sidebar */}
        <DocsSidebar
          className="lg:hidden"
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-6 md:p-8 lg:p-12 max-w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
