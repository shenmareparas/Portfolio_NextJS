import { SimpleIcon } from "simple-icons";

interface SimpleIconProps {
  icon: SimpleIcon;
  className?: string;
  color?: string;
  label?: string;
}

export const SimpleIconComponent = ({
  icon,
  className,
  color,
  label,
}: SimpleIconProps) => {
  return (
    <svg
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      viewBox="0 0 24 24"
      className={className}
      fill={color || "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={icon.path} />
    </svg>
  );
};
