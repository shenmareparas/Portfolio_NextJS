import { siGithub, siGoogleplay, siX } from "simple-icons/icons";
import { Linkedin } from "lucide-react";
import type { SimpleIcon } from "simple-icons";

const SimpleIconWrapper = (icon: SimpleIcon) => {
    const Icon = ({ className }: { className?: string }) => (
        <svg
            role="img"
            viewBox="0 0 24 24"
            className={`fill-current ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>{icon.title}</title>
            <path d={icon.path} />
        </svg>
    );
    Icon.displayName = `SimpleIconWrapper(${icon.title})`;
    return Icon;
};

export const socials = [
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/parasshenmare",
        icon: Linkedin,
    },
    {
        name: "GitHub",
        href: "https://github.com/shenmareparas",
        icon: SimpleIconWrapper(siGithub),
    },
    {
        name: "Play Store",
        href: "https://play.google.com/store/apps/dev?id=5625933656259473047",
        icon: SimpleIconWrapper(siGoogleplay),
    },
    {
        name: "X (Twitter)",
        href: "https://x.com/parasshenmare",
        icon: SimpleIconWrapper(siX),
    },
];
