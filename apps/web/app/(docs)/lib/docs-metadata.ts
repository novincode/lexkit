import { Metadata } from 'next'
import { docsConfig } from '../lib/docs-config'

export function generateDocsMetadata(pathname: string): Metadata {
  // Normalize pathname (remove trailing slashes, handle index routes)
  const normalizedPath = pathname.replace(/\/$/, '') || '/docs'

  // Find page data from docs config
  for (const section of docsConfig) {
    for (const item of section.items) {
      if (item.href === normalizedPath) {
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

  // Handle special cases
  if (normalizedPath === '/docs') {
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

  // Generate metadata for unknown paths (extensions, API docs, etc.)
  const pathSegments = normalizedPath.split('/').filter(Boolean)
  const lastSegment = pathSegments[pathSegments.length - 1]
  const title = lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ') : 'Documentation'

  return {
    title: `${title} | LexKit Documentation`,
    description: `Learn about ${title.toLowerCase()} in LexKit documentation. Type-safe rich text editor framework built on Meta's Lexical.`,
    keywords: ['LexKit', 'rich text editor', 'TypeScript', 'Lexical', 'documentation', title.toLowerCase()],
    openGraph: {
      title: `${title} | LexKit Documentation`,
      description: `Learn about ${title.toLowerCase()} in LexKit documentation. Type-safe rich text editor framework built on Meta's Lexical.`,
      type: 'article',
      siteName: 'LexKit',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | LexKit Documentation`,
      description: `Learn about ${title.toLowerCase()} in LexKit documentation. Type-safe rich text editor framework built on Meta's Lexical.`,
    },
  }
}
