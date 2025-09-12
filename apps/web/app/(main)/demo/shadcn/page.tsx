'use client'

import React from 'react';
import { ShadcnTemplate } from '../../../../components/templates/shadcn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { Sparkles, Palette, Zap } from 'lucide-react';

export default function ShadcnTemplatePage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">SHADCN Editor Template</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern, beautiful rich text editor built with SHADCN/UI components. 
          Experience the future of content creation with sleek design and powerful features.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            SHADCN/UI
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Modern 2025
          </Badge>
          <Badge variant="outline">Fully Featured</Badge>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Modern Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Built with the latest SHADCN/UI components for a clean, modern interface that follows current design trends.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Beautiful UI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Every component is carefully crafted with proper spacing, typography, and interactive states for the best user experience.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Full Featured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              All the features you need: formatting, tables, images, code blocks, and more - all with modern SHADCN styling.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Editor */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Try the SHADCN Editor</CardTitle>
          <CardDescription>
            Start typing to experience the modern, beautiful editor interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShadcnTemplate />
        </CardContent>
      </Card>
    </div>
  );
}
