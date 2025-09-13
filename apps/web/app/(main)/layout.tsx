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
                className="top-0 sticky z-[99999]"
            />



            {/* Main Content */}
            <div className="flex-1 ">
                {children}
            </div>

            <Footer />
        </div>
    )
}
