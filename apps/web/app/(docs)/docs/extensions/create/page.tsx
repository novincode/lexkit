import { Metadata } from 'next'
import ExtensionsPageClient from './page.client'

export const metadata: Metadata = {
  title: 'Extensions | LexKit',
  description: 'Learn how to create and use extensions in LexKit to customize your rich text editor.',
}

export default function ExtensionsPage() {
  return <ExtensionsPageClient />
}