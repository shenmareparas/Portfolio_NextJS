import { socials } from "@/data/socials";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a className="font-medium underline underline-offset-4">
                            Paras
                        </a>
                        . Source code is available on{" "}
                        <a
                            href="https://github.com/shenmareparas/Portfolio_NextJS"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4 cursor-hover"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {socials.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors cursor-hover"
                            aria-label={social.name}
                        >
                            <social.icon className="h-5 w-5" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
