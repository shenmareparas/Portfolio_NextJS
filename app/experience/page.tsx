import { ExperienceTimeline } from "@/components/experience-timeline";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Experience",
    description: "My professional journey in mobile development.",
};

export default function ExperiencePage() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                    Work Experience
                </h1>
                <p className="text-xl text-muted-foreground">
                    My professional journey in mobile development.
                </p>
            </div>

            <ExperienceTimeline />
        </div>
    );
}
