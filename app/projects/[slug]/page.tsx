import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { ArrowLeft, ArrowRight, Github, Smartphone, Globe } from "lucide-react";
import { siGoogleplay } from "simple-icons/icons";
import { SimpleIconComponent } from "@/components/ui/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { FadeIn } from "@/components/motion/fade-in";
import { projects as projectsData } from "@/data/projects";

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

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = projectsData.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    const currentIndex = projectsData.findIndex((p) => p.slug === slug);
    const prevProject = projectsData[currentIndex - 1];
    const nextProject = projectsData[currentIndex + 1];

    const accentLight =
        typeof project.accentColor === "object"
            ? project.accentColor.light
            : project.accentColor;
    const accentDark =
        typeof project.accentColor === "object"
            ? project.accentColor.dark
            : project.accentColor;

    return (
        <div className="container mx-auto py-12 px-4 space-y-12 pb-24 md:pb-12">
            {/* Back Button */}
            <FadeIn>
                <BackButton
                    href="/projects"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors cursor-hover"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </BackButton>
            </FadeIn>

            <div className="grid gap-8 xl:grid-cols-2">
                {/* Content Column */}
                <FadeIn className="space-y-6" delay={0.1}>
                    <Image
                        src={project.logo}
                        alt={`${project.title} logo`}
                        width={80}
                        height={80}
                        loading="lazy"
                        className="mb-4 rounded-2xl"
                    />
                    <h1 className="text-4xl font-bold tracking-tight">
                        {project.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="accented"
                                shape="pill"
                                style={
                                    project.accentColor
                                        ? ({
                                              "--accent-light": accentLight,
                                              "--accent-dark": accentDark,
                                              "--accent-light-bg": `${accentLight}15`,
                                              "--accent-dark-bg": `${accentDark}15`,
                                          } as React.CSSProperties)
                                        : undefined
                                }
                            >
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

                    <div className="flex flex-wrap gap-4 underline-offset-4">
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
                </FadeIn>

                {/* Carousel Column */}
                <div className="w-full mx-auto xl:fixed xl:top-16 xl:right-0 xl:h-[calc(100vh-8rem)] xl:w-1/2 xl:flex xl:items-center xl:justify-center pointer-events-none xl:pointer-events-auto">
                    <FadeIn
                        className="pointer-events-auto w-full h-full"
                        delay={0.1}
                    >
                        <CoverflowCarousel
                            className="h-full xl:py-0 w-[calc(100%+2rem)] -mx-4 xl:w-full xl:mx-0"
                            images={project.gallery || []}
                        />
                    </FadeIn>
                </div>
            </div>

            {/* Project Navigation - Stays on left in desktop, moves to bottom in mobile */}
            <div className="xl:w-1/2">
                <FadeIn delay={0.2}>
                    <div className="flex flex-row justify-between items-start gap-4 pt-12 border-t border-border/40">
                        {prevProject ? (
                            <Button
                                asChild
                                variant="ghost"
                                className="group h-auto p-0 hover:bg-transparent flex-1 justify-start max-w-[45%]"
                            >
                                <Link
                                    href={`/projects/${prevProject.slug}`}
                                    className="flex flex-col items-start gap-2"
                                >
                                    <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2 uppercase tracking-wider font-semibold whitespace-nowrap">
                                        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                                        Previous
                                    </span>
                                    <span className="text-base sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                        {prevProject.title}
                                    </span>
                                </Link>
                            </Button>
                        ) : (
                            <div className="flex-1" />
                        )}
                        {nextProject ? (
                            <Button
                                asChild
                                variant="ghost"
                                className="group h-auto p-0 hover:bg-transparent flex-1 justify-end max-w-[45%]"
                            >
                                <Link
                                    href={`/projects/${nextProject.slug}`}
                                    className="flex flex-col items-end gap-2"
                                >
                                    <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2 uppercase tracking-wider font-semibold whitespace-nowrap">
                                        Next
                                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <span className="text-base sm:text-xl font-bold group-hover:text-primary transition-colors text-right line-clamp-1">
                                        {nextProject.title}
                                    </span>
                                </Link>
                            </Button>
                        ) : (
                            <div className="flex-1" />
                        )}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
