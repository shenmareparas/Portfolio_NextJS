"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { GoToTop } from "@/components/ui/go-to-top";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isQrPage = pathname === "/qr";

  if (isQrPage) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-xl focus:ring-2 focus:ring-ring focus:outline-none"
        >
          Skip to main content
        </a>
        <main
          id="main-content"
          tabIndex={-1}
          className="block w-full min-h-screen focus:outline-none"
        >
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-xl focus:ring-2 focus:ring-ring focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <GoToTop />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex flex-col pt-16 pb-20 md:pb-16 focus:outline-none"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
