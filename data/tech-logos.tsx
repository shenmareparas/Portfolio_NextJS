import { SimpleIconComponent } from "@/components/ui/simple-icon";
import { LogoItem } from "@/components/ui/logo-loop";
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siTailwindcss,
  siFlutter,
  siDart,
  siKotlin,
  siSwift,
  siPython,
  siNodedotjs,
  siFirebase,
  siSupabase,
  siAndroid,
  siGit,
  siFigma,
} from "simple-icons/icons";

export const techLogos: LogoItem[] = [
  {
    node: <SimpleIconComponent icon={siReact} className="h-8 w-8" />,
    title: "React",
  },
  {
    node: <SimpleIconComponent icon={siNextdotjs} className="h-8 w-8" />,
    title: "Next.js",
  },
  {
    node: <SimpleIconComponent icon={siTypescript} className="h-8 w-8" />,
    title: "TypeScript",
  },
  {
    node: <SimpleIconComponent icon={siJavascript} className="h-8 w-8" />,
    title: "JavaScript",
  },
  {
    node: <SimpleIconComponent icon={siTailwindcss} className="h-8 w-8" />,
    title: "Tailwind CSS",
  },
  {
    node: <SimpleIconComponent icon={siFlutter} className="h-8 w-8" />,
    title: "Flutter",
  },
  {
    node: <SimpleIconComponent icon={siDart} className="h-8 w-8" />,
    title: "Dart",
  },
  {
    node: <SimpleIconComponent icon={siKotlin} className="h-8 w-8" />,
    title: "Kotlin",
  },
  {
    node: <SimpleIconComponent icon={siSwift} className="h-8 w-8" />,
    title: "Swift",
  },
  {
    node: <SimpleIconComponent icon={siPython} className="h-8 w-8" />,
    title: "Python",
  },
  {
    node: <SimpleIconComponent icon={siNodedotjs} className="h-8 w-8" />,
    title: "Node.js",
  },
  {
    node: <SimpleIconComponent icon={siFirebase} className="h-8 w-8" />,
    title: "Firebase",
  },
  {
    node: <SimpleIconComponent icon={siSupabase} className="h-8 w-8" />,
    title: "Supabase",
  },
  {
    node: <SimpleIconComponent icon={siAndroid} className="h-8 w-8" />,
    title: "Android",
  },
  {
    node: <SimpleIconComponent icon={siGit} className="h-8 w-8" />,
    title: "Git",
  },
  {
    node: <SimpleIconComponent icon={siFigma} className="h-8 w-8" />,
    title: "Figma",
  },
];
