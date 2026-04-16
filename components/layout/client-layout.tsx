"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { GoToTop } from "@/components/ui/go-to-top";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isQrPage = pathname === "/qr";

    if (isQrPage) {
        return <main className="block w-full min-h-screen">{children}</main>;
    }

    return (
        <>
            <Header />
            <GoToTop />
            <main className="flex-1 flex flex-col pt-16 pb-20 md:pb-16">
                {children}
            </main>
            <Footer />
        </>
    );
}
