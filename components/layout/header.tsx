"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import { Home, FolderCode, User, Send, Search } from "lucide-react";
import { useMobileHaptics } from "@/hooks/use-mobile-haptics";
import { useKeyboard } from "@/components/providers/keyboard-provider";

import { useSyncExternalStore } from "react";
import { AnimatePresence, m } from "framer-motion";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderCode },
  { name: "About", href: "/about", icon: User },
  { name: "Contact", href: "/contact", icon: Send },
];

export function Header() {
  const pathname = usePathname();
  const haptic = useMobileHaptics();
  const { openCommandPalette } = useKeyboard();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <>
      <m.header className="fixed top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/95 border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
          <div className="flex items-center gap-2 z-50">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-hover rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="text-xl font-bold">Paras Shenmare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              const handleClick = (e: React.MouseEvent) => {
                if (isActive) {
                  e.preventDefault();
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }
              };

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClick}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-hover rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <AnimatePresence>
                    {isActive && (
                      <m.span
                        key="navbar-active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-0 bg-secondary rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 z-50">
            <button
              type="button"
              onClick={openCommandPalette}
              className="group flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 hover:bg-muted/70 hover:border-border/80 px-2.5 sm:px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-[colors,border-color,box-shadow] duration-200 shadow-2xs backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
              aria-label="Search and command palette (⌘K)"
              title="Search and commands (⌘K)"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-foreground transition-colors" />
              <span className="hidden sm:inline font-normal text-muted-foreground group-hover:text-foreground transition-colors">
                Search...
              </span>
              <kbd className="hidden sm:inline-flex items-center rounded border border-border/60 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground/90 group-hover:text-foreground group-hover:border-border transition-colors shadow-2xs">
                ⌘K
              </kbd>
            </button>

            <ThemeSwitcher />
          </div>
        </div>
      </m.header>

      {mounted &&
        typeof window !== "undefined" &&
        createPortal(
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40">
              <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  const handleClick = (e: React.MouseEvent) => {
                    haptic.trigger("selection");
                    if (isActive) {
                      e.preventDefault();
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                  };

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleClick}
                      className={cn(
                        "relative flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <AnimatePresence>
                        {isActive && (
                          <m.span
                            key="bottom-tab-active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.2,
                            }}
                            className="absolute inset-x-2 top-1 bottom-1 z-0 bg-primary/10 rounded-xl"
                          />
                        )}
                      </AnimatePresence>
                      <Icon
                        className={cn(
                          "relative z-10 w-5 h-5 mb-1 transition-transform",
                          isActive && "scale-110",
                        )}
                      />
                      <span
                        className={cn(
                          "relative z-10 text-xs font-medium transition-colors",
                          isActive && "font-semibold",
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
              {/* Safe area padding for devices with home indicator */}
              <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
          </nav>,
          document.body,
        )}
    </>
  );
}
