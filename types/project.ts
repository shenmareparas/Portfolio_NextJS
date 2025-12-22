export type GalleryItem = string | { light: string; dark: string };

export interface Project {
    slug: string;
    title: string;
    description: string;
    fullDescription: string;
    tags: string[];
    role: string;
    timeline: string;
    links: {
        github?: string;
        demo?: string;
        playStore?: string;
        appStore?: string;
        githubAdmin?: string;
    };
    image: string;
    logo: string;
    accentColor?: string | { light: string; dark: string };
    gallery?: GalleryItem[];
}
