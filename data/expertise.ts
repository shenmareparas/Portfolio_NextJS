export interface ExpertiseItem {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export const expertise: ExpertiseItem[] = [
    {
        id: "mobile-cross-platform",
        title: "Cross-Platform Mobile Development",
        icon: "smartphone",
        description:
            "I build high-performance, feature-rich mobile applications using Flutter and Dart. From complex state management to integrating native device features, I ensure seamless experiences on both Android and iOS platforms. My work includes AI-powered real-time utility apps used by thousands.",
    },
    {
        id: "mobile-native",
        title: "Native Android Development",
        icon: "code",
        description:
            "Experienced in crafting modern native Android apps using Kotlin and Jetpack Compose. I focus on following the latest Material Design guidelines, optimizing performance, and leveraging advanced Android APIs to build robust and scalable mobile solutions.",
    },
    {
        id: "web-fullstack",
        title: "Full Stack Web Development",
        icon: "globe",
        description:
            "I develop responsive and dynamic web applications using the Next.js ecosystem, React, and TypeScript. I integrate secure backends like Firebase and Supabase, ensuring type safety, SEO optimization, and fast load times for a superior user experience.",
    },
    {
        id: "ui-ux",
        title: "UI/UX & Interactive Design",
        icon: "palette",
        description:
            "I combine technical skills with a keen eye for design to create visually stunning interfaces. Using tools like Figma for prototyping and libraries like Framer Motion for animations, I bring static designs to life with fluid interactions and intuitive layouts.",
    },
];
