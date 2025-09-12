'use client'

import React from 'react';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { SimpleCodeBlock } from '@/app/(docs)/components/simple-code-block';
import { getRawCode, getHighlightedCode } from '@/lib/generated/code-registry';
import {
  Github,
  GitBranch,
  Code,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Users,
  Zap,
  Target,
  MessageSquare,
  FileText,
  Terminal,
  Settings
} from 'lucide-react';

export default function ContributingPageClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Contributing to LexKit</h1>
          <p className="text-xl text-muted-foreground mt-2">Help us build the future of rich text editing</p>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          LexKit is an open-source project built with modern web technologies.
          We welcome contributions from developers of all skill levels.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1">
            <Github className="h-3 w-3 mr-1" />
            Open Source
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            Community Driven
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Code className="h-3 w-3 mr-1" />
            TypeScript
          </Badge>
        </div>
      </div>

      {/* Getting Started */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Getting Started</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LexKit is a monorepo built with modern tools. Here's how to get started with development.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Github className="h-6 w-6 text-primary" />
                Clone the Repository
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LexKit is hosted on GitHub. Clone the repository to get started:
              </p>
              <SimpleCodeBlock
                title="Clone the LexKit repository"
                html={getHighlightedCode('contributing-clone-repo') || ''}
                raw={getRawCode('contributing-clone-repo') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Terminal className="h-6 w-6 text-primary" />
                Install Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LexKit uses pnpm for package management. Install all dependencies:
              </p>
              <SimpleCodeBlock
                title="Install dependencies"
                html={getHighlightedCode('contributing-install-deps') || ''}
                raw={getRawCode('contributing-install-deps') || ''}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                Start Development Server
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Run the development server to see your changes in action:
              </p>
              <SimpleCodeBlock
                title="Start the development server"
                html={getHighlightedCode('contributing-dev-server') || ''}
                raw={getRawCode('contributing-dev-server') || ''}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Structure */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Project Structure</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          LexKit is organized as a monorepo with clear separation of concerns.
        </p>

        <Card>
          <CardContent>
            <SimpleCodeBlock
              title="LexKit Monorepo Structure"
              html={getHighlightedCode('contributing-project-structure') || ''}
              raw={getRawCode('contributing-project-structure') || ''}
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="h-5 w-5 text-primary" />
                packages/
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Core packages including the editor system, UI components, and TypeScript configurations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                apps/web/
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The main web application with documentation, demos, and examples.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Development Workflow */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Development Workflow</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Follow these best practices to ensure smooth collaboration.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <GitBranch className="h-6 w-6 text-primary" />
                Branching Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Create feature branches from <code>main</code> for all changes:
                </p>
                <SimpleCodeBlock
                  title="Create a feature branch"
                  html={getHighlightedCode('contributing-create-branch') || ''}
                  raw={getRawCode('contributing-create-branch') || ''}
                />
                <p className="text-muted-foreground leading-relaxed">
                  Use descriptive branch names like <code>feature/add-link-extension</code> or <code>fix/toolbar-bug</code>.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                Code Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Before submitting a PR, ensure your code passes all checks:
                </p>
                <SimpleCodeBlock
                  title="Run quality checks"
                  html={getHighlightedCode('contributing-run-checks') || ''}
                  raw={getRawCode('contributing-run-checks') || ''}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                Pull Request Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  When your changes are ready, create a pull request with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Clear description of the changes</li>
                  <li>Link to any related issues</li>
                  <li>Screenshots for UI changes</li>
                  <li>Tests for new functionality</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Best Practices</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Guidelines for writing maintainable, high-quality code.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                TypeScript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Use strict TypeScript types</li>
                <li>Avoid <code>any</code> types when possible</li>
                <li>Document complex type definitions</li>
                <li>Use utility types for common patterns</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Document all public APIs with JSDoc</li>
                <li>Update docs for API changes</li>
                <li>Add examples for complex features</li>
                <li>Keep README files up to date</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Write tests for new features</li>
                <li>Test edge cases and error conditions</li>
                <li>Ensure tests pass before submitting</li>
                <li>Update tests when changing APIs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Code Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Review your own code first</li>
                <li>Be constructive in feedback</li>
                <li>Consider performance implications</li>
                <li>Ensure code follows project conventions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Need Help? */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Need Help?</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          Don't hesitate to reach out if you need assistance or have questions.
        </p>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <Link href="https://github.com/novincode/lexkit/issues">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Github className="h-6 w-6 text-primary" />
                  GitHub Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Report bugs, request features, or ask questions on our GitHub repository.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="https://github.com/novincode/lexkit/discussions">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  GitHub Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Join community discussions, share ideas, and get help from other contributors.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
