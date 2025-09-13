import { Geist, Geist_Mono, Fira_Code } from "next/font/google"
import { Metadata, Viewport } from "next"
import Script from "next/script"

import "@repo/ui/globals.css"
import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontFira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Next.js Metadata API
export const metadata: Metadata = {
  title: {
    default: "LexKit - Free Open Source Rich Text Editor",
    template: "%s | LexKit"
  },
  description: "LexKit is a free, open-source, modern rich text editor built for React developers. Features drag-and-drop blocks, customizable extensions, and seamless integration with Lexical framework.",
  keywords: [
    "rich text editor",
    "React editor",
    "Lexical editor",
    "open source editor",
    "drag and drop editor",
    "WYSIWYG editor",
    "JavaScript editor",
    "TypeScript editor",
    "modern editor",
    "free editor",
    "web editor",
    "content editor",
    "text editor",
    "HTML editor",
    "markdown editor"
  ],
  authors: [{ name: "LexKit Team" }],
  creator: "LexKit Team",
  publisher: "LexKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lexkit.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lexkit.dev",
    title: "LexKit - Free Open Source Rich Text Editor",
    description: "Modern, React-friendly rich text editor built on Lexical. Free, open-source, and fully customizable with drag-and-drop functionality.",
    siteName: "LexKit",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "LexKit - Modern Rich Text Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LexKit - Free Open Source Rich Text Editor",
    description: "Modern, React-friendly rich text editor built on Lexical. Free, open-source, and fully customizable.",
    images: ["/images/twitter-card.svg"],
    creator: "@lexkit_editor",
    site: "@lexkit_editor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico", sizes: "any" },
      { url: "/images/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/images/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LexKit",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "application-name": "LexKit Editor",
  },
}

// Next.js Viewport API
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans ${fontFira.className} antialiased overflow-x-hidden`}
      >
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LexKit",
              "description": "Free, open-source, modern rich text editor built for React developers using Lexical framework",
              "url": "https://lexkit.dev",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "programmingLanguage": "TypeScript, React",
              "author": {
                "@type": "Organization",
                "name": "LexKit Team"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Drag and Drop Blocks",
                "Customizable Extensions",
                "React Integration",
                "TypeScript Support",
                "Modern UI Components",
                "Open Source",
                "Free to Use"
              ],
              "keywords": "rich text editor, React, Lexical, open source, drag and drop, WYSIWYG"
            })
          }}
        />
        <Providers>
          <div className="flex min-h-screen flex-col">
            {/* <TopNavigation /> */}
            <main className="flex-1">
              {children}
            </main>
            {/* <Footer /> */}
          </div>
        </Providers>
      </body>
    </html>
  )
}
