import { SimpleIcon } from "simple-icons";

interface SimpleIconProps {
    icon: SimpleIcon;
    className?: string;
    color?: string;
}

export const SimpleIconComponent = ({
    icon,
    className,
    color,
}: SimpleIconProps) => {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            className={className}
            fill={color || "currentColor"}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={icon.path} />
        </svg>
    );
};
