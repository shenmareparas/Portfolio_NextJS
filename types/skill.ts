import { LucideIcon } from "lucide-react";
import type { SimpleIcon } from "simple-icons";

export interface Skill {
    name: string;
    icon?:
        | LucideIcon
        | React.ComponentType<{ className?: string }>
        | SimpleIcon;
}

export interface Skills {
    languages: Skill[];
    mobile: Skill[];
    web: Skill[];
    backend: Skill[];
    tools: Skill[];
}
