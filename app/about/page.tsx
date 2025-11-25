import { skills } from "@/data/skills";
import { education, certifications, achievements } from "@/data/education";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "lucide-react";
import { FadeIn } from "@/components/fade-in";

export const metadata = {
    title: "About Me",
    description: "Learn more about my background, skills, and education.",
};

export default function AboutPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 space-y-16">
            {/* Bio Section */}
            <FadeIn>
                <section className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        About Me
                    </h1>
                    <div className="prose dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed">
                        <p>
                            Hello! I&apos;m Paras, a passionate Mobile Developer
                            with a strong foundation in building cross-platform
                            and native applications. My journey in software
                            development started with a curiosity for how things
                            work on the little screens we carry everywhere.
                        </p>
                        <p>
                            I specialize in creating intuitive, user-friendly
                            mobile experiences using technologies like React
                            Native, Flutter, and native iOS/Android frameworks.
                            I believe in writing clean, maintainable code and
                            staying up-to-date with the latest industry trends.
                        </p>
                        <p>
                            When I&apos;m not coding, you can find me exploring
                            new tech, contributing to open-source projects, or
                            enjoying a good cup of coffee.
                        </p>
                    </div>
                </section>
            </FadeIn>

            {/* Skills Section */}
            <FadeIn delay={0.1}>
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Skills & Tools
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">
                                Mobile Development
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.mobile.map((skill) => (
                                    <div
                                        key={skill}
                                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">
                                Backend & Services
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.backend.map((skill) => (
                                    <div
                                        key={skill}
                                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-xl font-semibold">
                                Tools & Technologies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.tools.map((skill) => (
                                    <div
                                        key={skill}
                                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </FadeIn>

            {/* Education Section */}
            <FadeIn delay={0.2}>
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Education
                    </h2>
                    <div className="space-y-8">
                        {education.map((edu, index) => (
                            <div
                                key={index}
                                className="relative border-l border-muted-foreground/20 pl-6 pb-2"
                            >
                                <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-semibold">
                                        {edu.institution}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {edu.degree}
                                    </p>
                                    <span className="text-sm text-muted-foreground/80">
                                        {edu.year}
                                    </span>
                                    <p className="mt-2 text-muted-foreground">
                                        {edu.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </FadeIn>

            {/* Certifications Section */}
            <FadeIn delay={0.3}>
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Certifications
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {certifications.map((cert, index) => (
                            <Link
                                key={index}
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 transition-colors hover:bg-accent/50 h-full relative">
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold leading-none tracking-tight mb-2 pr-6">
                                        {cert.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {cert.issuer} • {cert.year}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </FadeIn>

            {/* Achievements Section */}
            <FadeIn delay={0.4}>
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Achievements
                    </h2>
                    <div className="space-y-4">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-lg border bg-card text-card-foreground shadow-sm p-4"
                            >
                                <Badge className="h-2 w-2 rounded-full bg-primary p-0" />
                                <span className="font-medium">
                                    {achievement}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </FadeIn>
        </div>
    );
}
