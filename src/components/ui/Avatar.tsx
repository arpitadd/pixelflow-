import { getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-lg",
};

export function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const sizeClass = sizeMap[size];

  return (
    <div className={`avatar ${src ? "" : "placeholder"} ${className}`}>
      <div className={`${sizeClass} rounded-full ring-2 ring-base-300`}>
        {src ? (
          <Image src={src} alt={name} fill className="object-cover rounded-full" />
        ) : (
          <span className="bg-gradient-to-br from-primary to-secondary text-primary-content font-semibold flex items-center justify-center w-full h-full rounded-full">
            {getInitials(name)}
          </span>
        )}
      </div>
    </div>
  );
}
