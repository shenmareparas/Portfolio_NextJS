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
    siApple,
} from "simple-icons/icons";
import {
    Layout,
    Globe,
    Settings,
    Workflow,
    Terminal,
    Sparkles,
    Cloud,
    Code,
} from "lucide-react";
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
    mobile: [
        { name: "Flutter", icon: SimpleIconWrapper(siFlutter) },
        { name: "Kotlin", icon: SimpleIconWrapper(siKotlin) },
        { name: "SwiftUI", icon: SimpleIconWrapper(siSwift) },
        { name: "Jetpack Compose", icon: Layout },
        { name: "Android Development", icon: SimpleIconWrapper(siAndroid) },
        { name: "iOS Development", icon: SimpleIconWrapper(siApple) },
    ],
    backend: [
        { name: "Firebase", icon: SimpleIconWrapper(siFirebase) },
        { name: "Node.js", icon: SimpleIconWrapper(siNodedotjs) },
        { name: "REST APIs", icon: Globe },
        { name: "AWS Cloud", icon: Cloud },
        { name: "Supabase", icon: SimpleIconWrapper(siSupabase) },
    ],
    tools: [
        { name: "Git", icon: SimpleIconWrapper(siGit) },
        { name: "Version Control", icon: Workflow },
        { name: "Figma", icon: SimpleIconWrapper(siFigma) },
        { name: "CI/CD", icon: Settings },
        { name: "XCode", icon: SimpleIconWrapper(siXcode) },
        { name: "Android Studio", icon: SimpleIconWrapper(siAndroidstudio) },
        { name: "VS Code", icon: Code },
        { name: "Cursor", icon: Terminal },
        { name: "Antigravity", icon: Sparkles },
    ],
};
