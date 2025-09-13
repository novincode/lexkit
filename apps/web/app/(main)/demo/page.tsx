'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Palette, Code } from 'lucide-react'

const page = () => {
  return (
    <div className='container mx-auto relative py-8'>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">LexKit Editor Demo</h1>
          <p className="text-lg text-muted-foreground">
            Choose a template to explore the different styling options available in LexKit
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Default Template Card */}
          <Link href="/demo/default" className="block">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="h-8 w-8 text-primary" />
                  <CardTitle>Default Template</CardTitle>
                </div>
                <CardDescription>
                  Clean, minimal styling with essential editor features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li>• Basic toolbar with essential formatting</li>
                  <li>• Simple, clean interface</li>
                  <li>• Lightweight and fast</li>
                  <li>• Perfect for basic editing needs</li>
                </ul>
                <Button className="w-full">
                  Try Default Template
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Shadcn Template Card */}
          <Link href="/demo/shadcn" className="block">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="h-8 w-8 text-primary" />
                  <CardTitle>Shadcn Template</CardTitle>
                </div>
                <CardDescription>
                  Modern, feature-rich editor with advanced UI components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li>• Advanced floating toolbar</li>
                  <li>• Modal dialogs for links and images</li>
                  <li>• Multiple editing modes (Visual/HTML/Markdown)</li>
                  <li>• Command palette for quick actions</li>
                  <li>• Drag & drop block reordering</li>
                </ul>
                <Button className="w-full" variant="outline">
                  Try Shadcn Template
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Both templates use the same underlying LexKit editor system with different UI implementations
          </p>
        </div>
      </div>
    </div>
  )
}

export default page