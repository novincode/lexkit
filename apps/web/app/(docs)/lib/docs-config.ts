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
        title: "Theming",
        href: "/docs/theming",
        description: "Customize the look and feel"
      }
    ]
  },
  {
    title: "Templates",
    items: [
      {
        title: "Default Template",
        href: "/docs/templates/default",
        description: "Basic editor setup"
      },
      {
        title: "Shadcn Template",
        href: "/docs/templates/shadcn",
        description: "Editor with Shadcn UI components"
      },
      
    ]
  },
  {
    title: "Core API",
    items: [
      {
        title: "createEditorSystem",
        href: "/docs/api/create-editor-system",
        description: "Core system creation and configuration"
      },
      {
        title: "Extensions API",
        href: "/docs/api/extensions",
        description: "Building and using extensions"
      },
      {
        title: "Type Definitions",
        href: "/docs/api/types",
        description: "Complete TypeScript definitions"
      },
      {
        title: "Contributing",
        href: "/docs/contributing",
        description: "How to contribute and extend LexKit"
      }
    ]
  }
]
