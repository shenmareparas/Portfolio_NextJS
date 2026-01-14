import { Skills } from "@/types/skill";
import {
    siFlutter,
    siKotlin,
    siSwift,
    siFirebase,
    siNodedotjs,
    siSupabase,
    siGit,
    siFigma,
    siXcode,
    siAndroidstudio,
    siAndroid,
    siNextdotjs,
    siPython,
    siDart,
    siHtml5,
    siCss,
    siJavascript,
    siTypescript,
    siReact,
    siTailwindcss,
    siFramer,
    siLinux,
} from "simple-icons/icons";
import { Globe, Terminal, Sparkles, Cloud, Code } from "lucide-react";
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

export const skills: Skills = {
    languages: [
        { name: "JavaScript", icon: SimpleIconWrapper(siJavascript) },
        { name: "TypeScript", icon: SimpleIconWrapper(siTypescript) },
        { name: "Python", icon: SimpleIconWrapper(siPython) },
        { name: "Dart", icon: SimpleIconWrapper(siDart) },
        { name: "Kotlin", icon: SimpleIconWrapper(siKotlin) },
        { name: "Swift", icon: SimpleIconWrapper(siSwift) },
        { name: "HTML", icon: SimpleIconWrapper(siHtml5) },
        { name: "CSS", icon: SimpleIconWrapper(siCss) },
    ],
    mobile: [
        { name: "React Native", icon: SimpleIconWrapper(siReact) },
        { name: "Flutter", icon: SimpleIconWrapper(siFlutter) },
        { name: "Jetpack Compose", icon: SimpleIconWrapper(siAndroid) },
        { name: "SwiftUI", icon: SimpleIconWrapper(siSwift) },
    ],
    web: [
        { name: "React", icon: SimpleIconWrapper(siReact) },
        { name: "Next.js", icon: SimpleIconWrapper(siNextdotjs) },
        { name: "Tailwind CSS", icon: SimpleIconWrapper(siTailwindcss) },
        { name: "Framer Motion", icon: SimpleIconWrapper(siFramer) },
    ],
    backend: [
        { name: "Node.js", icon: SimpleIconWrapper(siNodedotjs) },
        { name: "REST APIs", icon: Globe },
        { name: "Firebase", icon: SimpleIconWrapper(siFirebase) },
        { name: "Supabase", icon: SimpleIconWrapper(siSupabase) },
        { name: "AWS Cloud", icon: Cloud },
    ],
    tools: [
        { name: "Git", icon: SimpleIconWrapper(siGit) },
        { name: "Linux", icon: SimpleIconWrapper(siLinux) },
        { name: "VS Code", icon: Code },
        { name: "Cursor", icon: Terminal },
        { name: "XCode", icon: SimpleIconWrapper(siXcode) },
        { name: "Android Studio", icon: SimpleIconWrapper(siAndroidstudio) },
        { name: "Antigravity", icon: Sparkles },
        { name: "Figma", icon: SimpleIconWrapper(siFigma) },
    ],
};
