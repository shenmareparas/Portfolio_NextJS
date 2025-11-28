import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NavigationProvider } from "@/components/providers/navigation-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Preloader } from "@/components/ui/preloader";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Paras Shenmare",
        template: "%s | Paras S.",
    },
    description:
        "Portfolio of a passionate Mobile Developer specializing in Flutter, Android and iOS development.",
    keywords: [
        "Mobile Developer",
        "Flutter",
        "Android",
        "iOS",
        "Portfolio",
        "Software Engineer",
    ],
    metadataBase: new URL("https://parasnextjs.com"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <NavigationProvider>
                        <Preloader />
                        <CustomCursor />
                        <Header />
                        <main className="flex-1 md:pb-16">{children}</main>
                        <Footer />
                        <Toaster />
                    </NavigationProvider>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
