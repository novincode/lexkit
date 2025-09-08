import { Metadata } from 'next'
import { docsConfig } from '../lib/docs-config'

export function generateDocsMetadata(pathname: string): Metadata {
  // Find page data from docs config
  for (const section of docsConfig) {
    for (const item of section.items) {
      if (item.href === pathname) {
        const baseTitle = 'LexKit Documentation'
        const baseDescription = 'Type-safe rich text editor framework built on Meta\'s Lexical. Developer-friendly, extensible, and production-ready.'

        return {
          title: `${item.title} | ${baseTitle}`,
          description: item.description || baseDescription,
          keywords: [
            'LexKit',
            'rich text editor',
            'TypeScript',
            'Lexical',
            'documentation',
            item.title.toLowerCase(),
            ...(item.isNew ? ['new'] : [])
          ].filter(Boolean),
          openGraph: {
            title: `${item.title} | LexKit Documentation`,
            description: item.description || baseDescription,
            type: 'article',
            siteName: 'LexKit',
          },
          twitter: {
            card: 'summary_large_image',
            title: `${item.title} | LexKit Documentation`,
            description: item.description || baseDescription,
          },
        }
      }
    }
  }

  // Default metadata for pages not in docs config
  return {
    title: 'LexKit Documentation',
    description: 'Type-safe rich text editor framework built on Meta\'s Lexical. Developer-friendly, extensible, and production-ready.',
    keywords: ['LexKit', 'rich text editor', 'TypeScript', 'Lexical', 'documentation'],
    openGraph: {
      title: 'LexKit Documentation',
      description: 'Type-safe rich text editor framework built on Meta\'s Lexical. Developer-friendly, extensible, and production-ready.',
      type: 'website',
      siteName: 'LexKit',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'LexKit Documentation',
      description: 'Type-safe rich text editor framework built on Meta\'s Lexical. Developer-friendly, extensible, and production-ready.',
    },
  }
}
