import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Paras Shenmare",
    description: "Explore the projects and applications I've built using React, Next.js, Flutter, and more.",
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
