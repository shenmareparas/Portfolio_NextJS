"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useWebHaptics } from "web-haptics/react";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { RenderedIcon } from "@/components/ui/rendered-icon";
import { FadeIn } from "@/components/motion/fade-in";
import { m } from "framer-motion";
import { FileDown, UserPlus, Globe, Phone, Mail } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function QrContent() {
    const haptic = useWebHaptics();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    const handleHapticFeedback = (type: "light" | "medium" | "heavy" | "success" | "warning" | "error" | "selection" = "medium") => {
        haptic.trigger(type);
    };

    const generateVCard = () => {
        handleHapticFeedback("success");
        // Create a VCard
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName}
TITLE:${profile.title}
EMAIL:${profile.email}
TEL:${profile.phone}
URL:https://parasshenmare.com
END:VCARD`;

        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${profile.name}_Contact.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex w-full h-fit flex-col items-center justify-start px-4 pt-8 pb-12 sm:pt-12 mt-0 relative">
            {/* Theme Toggle in top right */}
            <div className="absolute right-4 top-4 z-50">
                <ThemeSwitcher className="h-10 w-10 border bg-card/50 backdrop-blur-sm" />
            </div>

            <FadeIn className="w-full max-w-md space-y-6 relative z-10 mt-0">
                {/* Profile Section */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10 text-3xl font-heading font-bold text-primary">
                        PS
                    </div>
                    
                    <div className="space-y-1">
                        <h1 className="font-heading text-3xl font-bold tracking-tight">
                            {profile.fullName}
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            {profile.title}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Highlighted Action */}
                    <Link
                        href="/"
                        onClick={() => handleHapticFeedback("medium")}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                        <Globe className="h-6 w-6" />
                        <span className="font-bold text-lg">View Portfolio</span>
                    </Link>

                    {/* Secondary Action */}
                    <a
                        href={profile.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleHapticFeedback("success")}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-primary/10 bg-primary/10 p-4 text-primary transition-all hover:bg-primary/20 active:scale-[0.98]"
                    >
                        <FileDown className="h-6 w-6" />
                        <span className="font-semibold text-base">My Resume</span>
                    </a>

                    {/* Quick Link Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <a
                            href={`tel:${profile.phone}`}
                            onClick={() => handleHapticFeedback("medium")}
                            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/10 p-4 text-primary transition-all hover:bg-primary/20 active:scale-95"
                        >
                            <Phone className="h-5 w-5" />
                            <span className="text-[10px] sm:text-xs font-semibold">Call</span>
                        </a>
                        <a
                            href={`mailto:${profile.email}`}
                            onClick={() => handleHapticFeedback("medium")}
                            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/10 p-4 text-primary transition-all hover:bg-primary/20 active:scale-95"
                        >
                            <Mail className="h-5 w-5" />
                            <span className="text-[10px] sm:text-xs font-semibold">Email</span>
                        </a>
                        <button
                            onClick={generateVCard}
                            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/10 p-4 text-primary transition-all hover:bg-primary/20 active:scale-95"
                        >
                            <UserPlus className="h-5 w-5" />
                            <span className="text-[10px] sm:text-xs font-semibold">Contact</span>
                        </button>
                    </div>
                </div>

                {/* Links Section */}
                <m.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                    className="flex flex-col space-y-4"
                >
                    {socials.map((social) => (
                        <m.a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleHapticFeedback("medium")}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                            }}
                            className="group flex w-full items-center justify-between overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <RenderedIcon icon={social.icon} className="h-5 w-5" />
                                </div>
                                <span className="font-semibold">{social.name}</span>
                            </div>
                            <div className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </div>
                        </m.a>
                    ))}
                </m.div>
            </FadeIn>
        </div>
    );
}
