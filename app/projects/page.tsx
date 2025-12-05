import { projects as projectsData } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";

export const metadata = {
    title: "Projects",
    description: "A showcase of my mobile and web development projects.",
};

export default function ProjectsPage() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
                <p className="text-xl text-muted-foreground">
                    Here are some of the projects I&apos;ve worked on.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projectsData.map((project, index) => (
                    <ProjectCard
                        key={project.slug}
                        project={project}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
}
