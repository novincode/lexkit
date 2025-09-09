export interface DocsSection {
  title: string
  items: DocsItem[]
}

export interface DocsItem {
  title: string
  href: string
  description?: string
  isNew?: boolean
}

export const docsConfig: DocsSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs/introduction",
        description: "Learn about LexKit and what makes it special"
      },
      {
        title: "Installation",
        href: "/docs/installation",
        description: "How to install and set up LexKit"
      },
      {
        title: "Get Started",
        href: "/docs/get-started",
        description: "Get up and running in minutes"
      }
    ]
  },
  {
    title: "Core Concepts",
    items: [
      {
        title: "Extensions",
        href: "/docs/extensions",
        description: "Understanding the extension system"
      },
      {
        title: "Commands & State",
        href: "/docs/commands-state",
        description: "Type-safe commands and state queries"
      },
      {
        title: "Theming",
        href: "/docs/theming",
        description: "Customize the look and feel"
      }
    ]
  },
  {
    title: "Extensions",
    items: [
      {
        title: "Text Formatting",
        href: "/docs/extensions/text-formatting",
        description: "Bold, italic, underline, and more"
      },
      {
        title: "Lists",
        href: "/docs/extensions/lists",
        description: "Ordered and unordered lists"
      },
      {
        title: "Tables",
        href: "/docs/extensions/tables",
        description: "Rich table functionality",
        isNew: true
      },
      {
        title: "Images",
        href: "/docs/extensions/images",
        description: "Image upload and handling"
      },
      {
        title: "HTML & Markdown",
        href: "/docs/extensions/html-markdown",
        description: "Import and export functionality"
      }
    ]
  },
  {
    title: "Advanced",
    items: [
      {
        title: "Custom Extensions",
        href: "/docs/advanced/custom-extensions",
        description: "Building your own extensions"
      },
      {
        title: "Performance",
        href: "/docs/advanced/performance",
        description: "Optimization tips and best practices"
      },
      {
        title: "Troubleshooting",
        href: "/docs/advanced/troubleshooting",
        description: "Common issues and solutions"
      }
    ]
  },
  {
    title: "API Reference",
    items: [
      {
        title: "createEditorSystem",
        href: "/docs/api/create-editor-system",
        description: "Core system creation"
      },
      {
        title: "Extension API",
        href: "/docs/api/extension-api",
        description: "Extension development API"
      },
      {
        title: "Type Definitions",
        href: "/docs/api/types",
        description: "TypeScript type definitions"
      }
    ]
  }
]
