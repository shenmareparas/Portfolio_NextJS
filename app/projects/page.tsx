import { Metadata } from "next";
import { ProjectsClient } from "@/components/projects/projects-client";

export const metadata: Metadata = {
    title: "Projects",
    description: "Here are some of the projects I've worked on.",
    alternates: {
        canonical: "/projects",
    },
};

export default function ProjectsPage() {
    return <ProjectsClient />;
}
