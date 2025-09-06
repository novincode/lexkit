"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Github, ExternalLink } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@repo/ui/components/sidebar"
import { Badge } from "@repo/ui/components/badge"
import { Button } from "@repo/ui/components/button"
import { docsConfig } from "../lib/docs-config"

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r" collapsible="offcanvas">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">LexKit Docs</h2>
            <p className="text-sm text-muted-foreground">v1.0.0</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {docsConfig.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <span>{item.title}</span>
                          {item.isNew && (
                            <SidebarMenuBadge>
                              <Badge variant="secondary" className="h-5 text-xs">
                                New
                              </Badge>
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link 
                href="https://github.com/novincode/lexkit" 
                target="_blank"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link 
                href="https://lexkit.codeideal.com/demo" 
                target="_blank"
                className="flex items-center gap-2"
              >
                <span>Live Demo</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
