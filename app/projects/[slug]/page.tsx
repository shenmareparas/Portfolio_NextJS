import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github, Smartphone, Globe } from "lucide-react";
import { siGoogleplay } from "simple-icons/icons";
import { SimpleIconComponent } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import projectsData from "@/data/projects.json";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return projectsData.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = projectsData.find((p) => p.slug === slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: project.title,
        description: project.description,
    };
}

interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    fullDescription: string;
    tags: string[];
    role: string;
    timeline: string;
    links: {
        github: string;
        demo?: string;
        playStore?: string;
        appStore?: string;
        githubAdmin?: string;
    };
    image: string;
    gallery: string[];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = projectsData.find(
        (p) => p.slug === slug
    ) as unknown as Project;

    if (!project) {
        notFound();
    }

    return (
        <div className="container mx-auto py-12 px-4 space-y-12">
            {/* Back Button */}
            <Link
                href="/projects"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>

            {/* Hero Section */}
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {project.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {project.fullDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/40">
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                                Role
                            </h3>
                            <p className="mt-1 font-medium">{project.role}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                                Timeline
                            </h3>
                            <p className="mt-1 font-medium">
                                {project.timeline}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {project.links?.githubAdmin && (
                            <Button asChild variant="outline" className="gap-2">
                                <a
                                    href={project.links.githubAdmin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4" /> GitHub
                                    (Admin)
                                </a>
                            </Button>
                        )}
                        {project.links?.github && (
                            <Button asChild variant="outline" className="gap-2">
                                <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4" />{" "}
                                    {project.links.githubAdmin
                                        ? "GitHub (User)"
                                        : "GitHub"}
                                </a>
                            </Button>
                        )}
                        {project.links?.playStore && (
                            <Button asChild className="gap-2">
                                <a
                                    href={project.links.playStore}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <SimpleIconComponent
                                        icon={siGoogleplay}
                                        className="h-4 w-4"
                                    />{" "}
                                    Play Store
                                </a>
                            </Button>
                        )}
                        {project.links?.appStore && (
                            <Button asChild className="gap-2">
                                <a
                                    href={project.links.appStore}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Smartphone className="h-4 w-4" /> App Store
                                </a>
                            </Button>
                        )}
                        {project.links?.demo && (
                            <Button asChild className="gap-2">
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Globe className="h-4 w-4" /> Live Demo
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted shadow-sm">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>

            {/* Gallery Section */}
            {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Gallery
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {project.gallery.map((image, index) => (
                            <div
                                key={index}
                                className="relative aspect-[9/16] overflow-hidden rounded-lg border bg-muted shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Image
                                    src={image}
                                    alt={`${project.title} screenshot ${
                                        index + 1
                                    }`}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
