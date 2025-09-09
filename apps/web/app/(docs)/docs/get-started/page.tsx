import { Metadata } from 'next'
import { GetStartedPageClient } from './page.client'

export const metadata: Metadata = {
  title: 'Get Started | LexKit',
  description: 'Get started with LexKit - install, configure, and build your first rich text editor in minutes.',
}

export default function GetStartedPage() {
  return <GetStartedPageClient />
}
