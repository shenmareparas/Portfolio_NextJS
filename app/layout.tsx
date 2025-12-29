import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NavigationProvider } from "@/components/providers/navigation-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Preloader } from "@/components/ui/preloader";
import { GoToTop } from "@/components/ui/go-to-top";
import { siteConfig } from "@/data/config";
import { PortraitLock } from "@/components/ui/portrait-lock";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    keywords: siteConfig.keywords,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
        ...siteConfig.metadata.openGraph,
        url: siteConfig.url,
        title: siteConfig.title,
        description: siteConfig.description,
        images: [
            {
                url: "/cover.webp",
                width: 1200,
                height: 630,
                alt: siteConfig.title,
            },
        ],
    },
    twitter: {
        ...siteConfig.metadata.twitter,
        title: siteConfig.title,
        description: siteConfig.description,
        images: ["/cover.webp"],
    },
    applicationName: "Paras Shenmare Portfolio",
    authors: [{ name: "Paras Shenmare", url: siteConfig.url }],
    generator: "Next.js",
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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NavigationProvider>
                        <LoadingProvider>
                            <Preloader />
                            <CustomCursor />
                            <Header />
                            <GoToTop />
                            <main className="flex-1 flex flex-col pt-16 pb-20 md:pb-16">
                                {children}
                            </main>
                            <Footer />
                            <Toaster />
                        </LoadingProvider>
                    </NavigationProvider>
                </ThemeProvider>
                <Analytics />
                <PortraitLock />
            </body>
        </html>
    );
}
