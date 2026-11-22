import { SimpleIconComponent } from "@/components/ui/simple-icon";
import { LogoItem } from "@/components/ui/logo-loop";
import { AzureIcon } from "@/components/ui/azure-icon";
import { JavaIcon } from "@/components/ui/java-icon";
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siHtml5,
  siCss,
  siTailwindcss,
  siFramer,
  siFlutter,
  siDart,
  siAndroid,
  siKotlin,
  siSwift,
  siXcode,
  siAndroidstudio,
  siPython,
  siCplusplus,
  siNodedotjs,
  siBun,
  siFirebase,
  siSupabase,
  siGit,
  siLinux,
  siFigma,
} from "simple-icons/icons";
import { Globe, Terminal, Sparkles, Cloud, Code, Database } from "lucide-react";

export const techLogos: LogoItem[] = [
  // Web & Frontend
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
    node: <SimpleIconComponent icon={siHtml5} className="h-8 w-8" />,
    title: "HTML5",
  },
  {
    node: <SimpleIconComponent icon={siCss} className="h-8 w-8" />,
    title: "CSS3",
  },
  {
    node: <SimpleIconComponent icon={siTailwindcss} className="h-8 w-8" />,
    title: "Tailwind CSS",
  },
  {
    node: <SimpleIconComponent icon={siFramer} className="h-8 w-8" />,
    title: "Framer Motion",
  },

  // Mobile
  {
    node: <SimpleIconComponent icon={siFlutter} className="h-8 w-8" />,
    title: "Flutter",
  },
  {
    node: <SimpleIconComponent icon={siDart} className="h-8 w-8" />,
    title: "Dart",
  },
  {
    node: <SimpleIconComponent icon={siAndroid} className="h-8 w-8" />,
    title: "Android",
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
    node: <SimpleIconComponent icon={siXcode} className="h-8 w-8" />,
    title: "Xcode",
  },
  {
    node: <SimpleIconComponent icon={siAndroidstudio} className="h-8 w-8" />,
    title: "Android Studio",
  },

  // Languages & Core
  {
    node: <SimpleIconComponent icon={siPython} className="h-8 w-8" />,
    title: "Python",
  },
  {
    node: <JavaIcon className="h-8 w-8" />,
    title: "Java",
  },
  {
    node: <SimpleIconComponent icon={siCplusplus} className="h-8 w-8" />,
    title: "C++",
  },
  {
    node: <Database className="h-8 w-8" aria-hidden="true" />,
    title: "SQL",
  },

  // Backend & Cloud
  {
    node: <SimpleIconComponent icon={siNodedotjs} className="h-8 w-8" />,
    title: "Node.js",
  },
  {
    node: <SimpleIconComponent icon={siBun} className="h-8 w-8" />,
    title: "Bun",
  },
  {
    node: <Globe className="h-8 w-8" aria-hidden="true" />,
    title: "REST APIs",
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
    node: <Cloud className="h-8 w-8" aria-hidden="true" />,
    title: "AWS Cloud",
  },
  {
    node: <AzureIcon className="h-8 w-8" />,
    title: "Azure",
  },

  // Tools & Platforms
  {
    node: <SimpleIconComponent icon={siGit} className="h-8 w-8" />,
    title: "Git",
  },
  {
    node: <SimpleIconComponent icon={siLinux} className="h-8 w-8" />,
    title: "Linux",
  },
  {
    node: <Code className="h-8 w-8" aria-hidden="true" />,
    title: "VS Code",
  },
  {
    node: <Terminal className="h-8 w-8" aria-hidden="true" />,
    title: "Cursor",
  },
  {
    node: <Sparkles className="h-8 w-8" aria-hidden="true" />,
    title: "Antigravity",
  },
  {
    node: <SimpleIconComponent icon={siFigma} className="h-8 w-8" />,
    title: "Figma",
  },
];
