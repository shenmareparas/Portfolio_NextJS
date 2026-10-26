"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, m } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Search,
  Home,
  FolderCode,
  User,
  Send,
  QrCode,
  Moon,
  Sun,
  Mail,
  FileDown,
  Github,
  Linkedin,
  ArrowRight,
  Keyboard,
  Phone,
} from "lucide-react";
import { siGoogleplay, siX } from "simple-icons/icons";
import { SimpleIconComponent } from "@/components/ui/simple-icon";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { useToast } from "@/hooks/use-toast";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { setGlobalKeyboardNav } from "@/hooks/use-card-grid-nav";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShortcuts?: () => void;
}

interface PaletteItem {
  id: string;
  category: "Navigation" | "Projects" | "Actions";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  keywords?: string[];
  onSelect: () => void;
}

function GooglePlayIcon({ className }: { className?: string }) {
  return <SimpleIconComponent icon={siGoogleplay} className={className} />;
}

function XIcon({ className }: { className?: string }) {
  return <SimpleIconComponent icon={siX} className={className} />;
}

interface ItemRowProps {
  item: PaletteItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

function CommandPaletteItemRow({
  item,
  index,
  isSelected,
  onSelect,
  onHover,
}: ItemRowProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      data-item-index={index}
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-foreground",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
            isSelected
              ? "bg-primary-foreground/15 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{item.title}</p>
          {item.subtitle && (
            <p
              className={cn(
                "text-xs truncate",
                isSelected
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {item.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {item.badge && (
          <span
            className={cn(
              "text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider",
              isSelected
                ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {item.badge}
          </span>
        )}
        <ArrowRight
          className={cn(
            "h-3.5 w-3.5 opacity-0 transition-opacity",
            isSelected && "opacity-100",
          )}
        />
      </div>
    </button>
  );
}

function CommandPaletteFooter({
  onOpenShortcuts,
}: {
  onOpenShortcuts?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2.5 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <kbd className="font-mono px-1 py-0.2 rounded border border-border bg-background">
            ↑
          </kbd>
          <kbd className="font-mono px-1 py-0.2 rounded border border-border bg-background">
            ↓
          </kbd>{" "}
          Navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="font-mono px-1.5 py-0.2 rounded border border-border bg-background">
            ↵
          </kbd>{" "}
          Select
        </span>
      </div>
      <button
        type="button"
        onClick={onOpenShortcuts}
        className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
      >
        <kbd className="font-mono px-1 py-0.2 rounded border border-border bg-background">
          ?
        </kbd>{" "}
        All Shortcuts
      </button>
    </div>
  );
}

interface PaletteItemsConfig {
  router: ReturnType<typeof useRouter>;
  resolvedTheme: string | undefined;
  toggleTheme: () => void;
  copyEmail: () => void;
  copyPhone: () => void;
  onOpenShortcuts?: () => void;
}

function useCommandPaletteItems({
  router,
  resolvedTheme,
  toggleTheme,
  copyEmail,
  copyPhone,
  onOpenShortcuts,
}: PaletteItemsConfig): PaletteItem[] {
  return useMemo(() => {
    const isDark = resolvedTheme === "dark";

    const navItems: PaletteItem[] = [
      {
        id: "nav-home",
        category: "Navigation",
        title: "Home",
        subtitle: "Return to homepage overview",
        icon: Home,
        badge: "g h",
        keywords: ["home", "main", "start", "landing", "overview"],
        onSelect: () => router.push("/"),
      },
      {
        id: "nav-projects",
        category: "Navigation",
        title: "Projects",
        subtitle: "View all featured works & applications",
        icon: FolderCode,
        badge: "g p",
        keywords: ["projects", "apps", "work", "portfolio", "code"],
        onSelect: () => router.push("/projects"),
      },
      {
        id: "nav-about",
        category: "Navigation",
        title: "About",
        subtitle: "Background, skills, and education",
        icon: User,
        badge: "g a",
        keywords: [
          "about",
          "skills",
          "experience",
          "education",
          "bio",
          "profile",
        ],
        onSelect: () => router.push("/about"),
      },
      {
        id: "nav-contact",
        category: "Navigation",
        title: "Contact",
        subtitle: "Send a message or get in touch",
        icon: Send,
        badge: "g c",
        keywords: ["contact", "message", "email", "hire", "touch"],
        onSelect: () => router.push("/contact"),
      },
      {
        id: "nav-qr",
        category: "Navigation",
        title: "Digital Business Card",
        subtitle: "Direct QR contact card",
        icon: QrCode,
        keywords: ["qr", "card", "business card", "contact card", "vcard"],
        onSelect: () => router.push("/qr"),
      },
    ];

    const projectItems: PaletteItem[] = projects.map((p) => ({
      id: `proj-${p.slug}`,
      category: "Projects",
      title: p.title,
      subtitle: p.description,
      icon: FolderCode,
      badge: p.tags[0],
      keywords: ["project", "projects", ...p.tags],
      onSelect: () => router.push(`/projects/${p.slug}`),
    }));

    const actionItems: PaletteItem[] = [
      {
        id: "act-theme",
        category: "Actions",
        title: `Change Theme (Switch to ${isDark ? "Light" : "Dark"} Mode)`,
        subtitle: `Toggle between light and dark theme (Current: ${isDark ? "Dark" : "Light"})`,
        icon: isDark ? Sun : Moon,
        badge: "T",
        keywords: [
          "theme",
          "change theme",
          "toggle theme",
          "switch theme",
          "dark",
          "light",
          "mode",
          "color",
          "appearance",
          "switch",
        ],
        onSelect: toggleTheme,
      },
      {
        id: "act-email",
        category: "Actions",
        title: "Copy Email Address",
        subtitle: profile.email,
        icon: Mail,
        keywords: ["email", "copy email", "mail", "contact", "address"],
        onSelect: copyEmail,
      },
      {
        id: "act-phone",
        category: "Actions",
        title: "Copy Phone Number",
        subtitle: profile.phone,
        icon: Phone,
        keywords: [
          "phone",
          "copy phone",
          "call",
          "mobile",
          "contact",
          "number",
          "tel",
        ],
        onSelect: copyPhone,
      },
      {
        id: "act-resume",
        category: "Actions",
        title: "Download Resume",
        subtitle: "Open PDF CV",
        icon: FileDown,
        keywords: ["resume", "cv", "pdf", "download resume", "experience"],
        onSelect: () => window.open(profile.resumeLink, "_blank"),
      },
      {
        id: "act-playstore",
        category: "Actions",
        title: "Open Google Play Store Profile",
        subtitle: "Developer profile & Android apps",
        icon: GooglePlayIcon,
        keywords: [
          "google play",
          "play store",
          "playstore",
          "android",
          "apps",
          "developer",
          "google",
        ],
        onSelect: () =>
          window.open(
            socials.find((s) => s.name === "Play Store")?.href ||
              "https://play.google.com/store/apps/dev?id=5625933656259473047",
            "_blank",
          ),
      },
      {
        id: "act-x",
        category: "Actions",
        title: "Open X Profile",
        subtitle: "x.com/parasshenmare",
        icon: XIcon,
        keywords: ["x", "twitter", "tweet", "social", "profile"],
        onSelect: () =>
          window.open(
            socials.find((s) => s.name.startsWith("X"))?.href ||
              "https://x.com/parasshenmare",
            "_blank",
          ),
      },
      {
        id: "act-github",
        category: "Actions",
        title: "Open GitHub Profile",
        subtitle: "github.com/shenmareparas",
        icon: Github,
        keywords: ["github", "git", "code", "repo", "source"],
        onSelect: () =>
          window.open("https://github.com/shenmareparas", "_blank"),
      },
      {
        id: "act-linkedin",
        category: "Actions",
        title: "Open LinkedIn Profile",
        subtitle: "linkedin.com/in/parasshenmare",
        icon: Linkedin,
        keywords: ["linkedin", "social", "network", "connect"],
        onSelect: () =>
          window.open("https://www.linkedin.com/in/parasshenmare", "_blank"),
      },
      {
        id: "act-shortcuts",
        category: "Actions",
        title: "Keyboard Shortcuts",
        subtitle: "View complete list of hotkeys and navigation chords",
        icon: Keyboard,
        badge: "?",
        keywords: [
          "shortcuts",
          "keyboard",
          "hotkeys",
          "help",
          "keys",
          "commands",
          "cheat sheet",
        ],
        onSelect: () => onOpenShortcuts?.(),
      },
    ];

    return [...navItems, ...projectItems, ...actionItems];
  }, [
    resolvedTheme,
    router,
    toggleTheme,
    copyEmail,
    copyPhone,
    onOpenShortcuts,
  ]);
}

interface CommandPaletteResultsProps {
  listRef: React.RefObject<HTMLDivElement | null>;
  filteredItems: PaletteItem[];
  selectedIndex: number;
  query: string;
  onSelectItem: (item: PaletteItem) => void;
  onHoverIndex: (index: number) => void;
}

function CommandPaletteResults({
  listRef,
  filteredItems,
  selectedIndex,
  query,
  onSelectItem,
  onHoverIndex,
}: CommandPaletteResultsProps) {
  return (
    <div
      ref={listRef}
      id="command-palette-results"
      role="listbox"
      className="flex-1 overflow-y-auto p-2 space-y-1 overscroll-contain"
    >
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No matching results found for &ldquo;{query}&rdquo;
        </div>
      ) : (
        filteredItems.map((item, index) => (
          <CommandPaletteItemRow
            key={item.id}
            item={item}
            index={index}
            isSelected={index === selectedIndex}
            onSelect={() => onSelectItem(item)}
            onHover={() => onHoverIndex(index)}
          />
        ))
      )}
    </div>
  );
}

function CommandPaletteModal({
  onClose,
  onOpenShortcuts,
}: {
  onClose: () => void;
  onOpenShortcuts?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(() => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  }, [resolvedTheme, setTheme]);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(profile.email);
    toast({
      title: "Email copied",
      description: `${profile.email} copied to clipboard.`,
    });
  }, [toast]);

  const copyPhone = useCallback(() => {
    navigator.clipboard.writeText(profile.phone);
    toast({
      title: "Phone number copied",
      description: `${profile.phone} copied to clipboard.`,
    });
  }, [toast]);

  const allItems = useCommandPaletteItems({
    router,
    resolvedTheme,
    toggleTheme,
    copyEmail,
    copyPhone,
    onOpenShortcuts,
  });

  useScrollLock(true);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [allItems, query]);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 20);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(
      `[data-item-index="${selectedIndex}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleSelectItem = useCallback(
    (item: PaletteItem) => {
      setGlobalKeyboardNav(true);
      inputRef.current?.blur();
      onClose();
      item.onSelect();
      requestAnimationFrame(() => {
        const main = document.getElementById("main-content");
        if (main) {
          main.focus({ preventScroll: true });
        }
      });
    },
    [onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "?") {
      e.preventDefault();
      inputRef.current?.blur();
      onClose();
      onOpenShortcuts?.();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const activeItem = filteredItems[selectedIndex];
      if (activeItem) {
        handleSelectItem(activeItem);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      onClose();
      requestAnimationFrame(() => {
        const main = document.getElementById("main-content");
        if (main) {
          main.focus({ preventScroll: true });
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 sm:pt-24 overscroll-contain">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={() => {
          inputRef.current?.blur();
          onClose();
          requestAnimationFrame(() => {
            const main = document.getElementById("main-content");
            if (main) {
              main.focus({ preventScroll: true });
            }
          });
        }}
        className="fixed inset-0 bg-background/80 backdrop-blur-md overscroll-contain touch-none"
        aria-hidden="true"
      />

      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl max-h-[70vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden overscroll-contain"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <label htmlFor="command-palette-input" className="sr-only">
            Search commands and projects
          </label>
          <Search
            className="h-5 w-5 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
          <input
            id="command-palette-input"
            ref={inputRef}
            value={query}
            aria-label="Search commands and projects"
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search projects..."
            className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-autocomplete="list"
            aria-controls="command-palette-results"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <CommandPaletteResults
          listRef={listRef}
          filteredItems={filteredItems}
          selectedIndex={selectedIndex}
          query={query}
          onSelectItem={handleSelectItem}
          onHoverIndex={(index) => setSelectedIndex(index)}
        />

        <CommandPaletteFooter
          onOpenShortcuts={() => {
            onClose();
            onOpenShortcuts?.();
          }}
        />
      </m.div>
    </div>
  );
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenShortcuts,
}: CommandPaletteProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <CommandPaletteModal
          onClose={onClose}
          onOpenShortcuts={onOpenShortcuts}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}
