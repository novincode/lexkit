import { Geist, Geist_Mono } from "next/font/google"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
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
