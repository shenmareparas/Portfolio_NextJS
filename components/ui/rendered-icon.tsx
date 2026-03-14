import { LucideIcon } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import { SimpleIconComponent } from "./simple-icon";

interface RenderedIconProps {
    icon: LucideIcon | React.ComponentType<{ className?: string }> | SimpleIcon;
    className?: string;
}

export const RenderedIcon = ({ icon, className }: RenderedIconProps) => {
    if (!icon) return null;

    // Check if it's a SimpleIcon object (it has a 'path' and 'title' property)
    if (typeof icon === "object" && "path" in icon && "title" in icon) {
        return <SimpleIconComponent icon={icon} className={className} />;
    }

    // Otherwise it's a component (LucideIcon or custom)
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className={className} />;
};
