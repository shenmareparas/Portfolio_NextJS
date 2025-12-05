import { socials } from "@/data/socials";
import { siteConfig } from "@/data/config";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background md:fixed md:bottom-0 md:left-0 md:z-50 md:w-full md:bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0 px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a className="font-medium underline underline-offset-4">
                            {siteConfig.footer.builtBy}
                        </a>
                        . Source code is available on{" "}
                        <a
                            href={siteConfig.footer.githubLink}
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
                        <TooltipProvider key={social.name}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-hover"
                                        aria-label={social.name}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{social.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
        </footer>
    );
}
