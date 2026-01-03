import { ContactForm } from "@/components/contact/contact-form";
import { ContactCard } from "@/components/contact/contact-card";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socials } from "@/data/socials";
import { FadeIn } from "@/components/motion/fade-in";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { profile } from "@/data/profile";

export const metadata = {
    title: "Contact",
    description: "Get in touch with me for opportunities or collaborations.",
};

export default function ContactPage() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-12">
            <FadeIn>
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a project in mind or just want to say hi? I&apos;d
                        love to hear from you.
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={0.2}>
                <div className="grid gap-12 md:grid-cols-2 max-w-5xl mx-auto">
                    {/* Contact Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Send a Message
                            </h2>
                            <p className="text-muted-foreground">
                                Fill out the form below and I&apos;ll get back
                                to you as soon as possible.
                            </p>
                        </div>
                        <ContactForm />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Contact Information
                            </h2>
                            <p className="text-muted-foreground">
                                You can also reach me through the following
                                channels.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <ContactCard
                                    icon={
                                        <Mail className="h-5 w-5 text-primary" />
                                    }
                                    label="Email"
                                    value={profile.email}
                                    href={`mailto:${profile.email}`}
                                />
                                <ContactCard
                                    icon={
                                        <Phone className="h-5 w-5 text-primary" />
                                    }
                                    label="Phone"
                                    value={profile.phone}
                                    href={`tel:${profile.phone.replace(
                                        /\s/g,
                                        ""
                                    )}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-medium">Social Media</h3>
                            <div className="flex flex-wrap gap-4">
                                {socials.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <TooltipProvider key={social.name}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-12 w-12 rounded-full"
                                                        asChild
                                                    >
                                                        <a
                                                            href={social.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={
                                                                social.name
                                                            }
                                                        >
                                                            <Icon className="h-5 w-5" />
                                                        </a>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{social.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
