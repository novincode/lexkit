'use client'
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer"

interface Props {
    children: React.ReactNode
}

export default function DocsLayoutClient({ children }: Props) {

    return (
        <div className="flex flex-col min-h-screen">
            <TopNavigation
                className="top-0 sticky"
            />



                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <main className="p-4 md:p-8 lg:p-12 max-w-full mx-auto">
                        {children}
                    </main>
                </div>

            <Footer />
        </div>
    )
}
