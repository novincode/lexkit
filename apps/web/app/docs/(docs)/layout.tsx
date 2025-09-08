import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui/components/sidebar"
import { DocsSidebar } from "./components/docs-sidebar"
import "./docs.css"
import "./styles/prism.css"


export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div >
      <SidebarProvider defaultOpen={true}>
        <DocsSidebar />
        <SidebarInset>
          {/* Mobile sidebar trigger */}
          <div className="flex h-14 items-center border-b px-4 lg:hidden">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">LexKit Docs</h1>
          </div>
          
          <main className="flex-1 p-6 md:p-8 lg:p-12 max-w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
