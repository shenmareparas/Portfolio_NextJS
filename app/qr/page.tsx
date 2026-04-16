import { Metadata } from "next";
import { profile } from "@/data/profile";
import { QrContent } from "./qr-content";

export const metadata: Metadata = {
    title: `Connect | ${profile.fullName}`,
    description: `Professional contact information for ${profile.fullName} - ${profile.title}. Scan to save contact or follow on social media.`,
    openGraph: {
        title: `Connect with ${profile.fullName}`,
        description: `Connect with ${profile.fullName} - ${profile.title}`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `Connect with ${profile.fullName}`,
        description: `Digital business card for ${profile.fullName}`,
    },
};

export default function QrPage() {
    return <QrContent />;
}
