import { LucideIcon } from "lucide-react";

export interface Skill {
    name: string;
    icon?: LucideIcon | React.ComponentType<{ className?: string }>;
}

export interface Skills {
    languages: Skill[];
    mobile: Skill[];
    web: Skill[];
    backend: Skill[];
    tools: Skill[];
}
