"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useNavigation } from "@/components/providers/navigation-provider";
import { CommandPalette } from "@/components/ui/command-palette";
import { KeyboardShortcutsDialog } from "@/components/ui/keyboard-shortcuts-dialog";
import { AnimatePresence, m } from "framer-motion";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { setGlobalKeyboardNav } from "@/hooks/use-card-grid-nav";

interface KeyboardContextType {
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

interface GlobalShortcutsConfig {
  isCommandPaletteOpen: boolean;
  isHelpOpen: boolean;
  activeChord: string | null;
  router: ReturnType<typeof useRouter>;
  pathname: string;
  previousPath: string | null;
  toggleTheme: () => void;
  openCommandPalette: () => void;
  setCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveChord: React.Dispatch<React.SetStateAction<string | null>>;
}

function useGlobalKeyboardShortcuts(config: GlobalShortcutsConfig) {
  const chordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef(config);

  useEffect(() => {
    stateRef.current = config;
  }, [config]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;

      const navigateBackFromProject = () => {
        if (
          s.pathname?.startsWith("/projects/") &&
          s.pathname !== "/projects"
        ) {
          if (s.previousPath === "/projects") {
            s.router.back();
          } else {
            s.router.push("/projects");
          }
          return true;
        }
        return false;
      };

      // Check if user is typing inside an editable field
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // Allow Escape everywhere to close modals, blur active input, or navigate back on project page
      if (e.key === "Escape") {
        if (s.isCommandPaletteOpen) {
          e.preventDefault();
          s.setCommandPaletteOpen(false);
          return;
        }
        if (s.isHelpOpen) {
          e.preventDefault();
          s.setHelpOpen(false);
          return;
        }
        if (isInput) {
          target.blur();
          return;
        }
        const activeDialog = document.querySelector('[role="dialog"]');
        if (activeDialog) return;

        if (navigateBackFromProject()) {
          e.preventDefault();
          return;
        }
      }

      // Handle Backspace on project page (when not typing in an input/textarea)
      if (e.key === "Backspace") {
        if (isInput || s.isCommandPaletteOpen || s.isHelpOpen) return;
        const activeDialog = document.querySelector('[role="dialog"]');
        if (activeDialog) return;

        if (navigateBackFromProject()) {
          e.preventDefault();
          return;
        }
      }

      // Cmd+K or Ctrl+K works everywhere
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        s.setCommandPaletteOpen((prev) => !prev);
        s.setHelpOpen(false);
        return;
      }

      // If typing inside an input/textarea, ignore all single-key hotkeys
      if (isInput) return;

      // Single-key shortcuts
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        s.openCommandPalette();
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        s.setHelpOpen((prev) => !prev);
        s.setCommandPaletteOpen(false);
        return;
      }

      if ((e.key === "t" || e.key === "T") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        s.toggleTheme();
        return;
      }

      if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Direct page jump via numbers: 1 = Home, 2 = Projects, 3 = About, 4 = Contact
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === "1") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
          return;
        }
        if (e.key === "2") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/projects");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
          return;
        }
        if (e.key === "3") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/about");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
          return;
        }
        if (e.key === "4") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/contact");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
          return;
        }
      }

      // Vim-style chord navigation: "g" followed by "h", "p", "a", "c"
      if (
        !s.activeChord &&
        (e.key === "g" || e.key === "G") &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        s.setActiveChord("g");
        if (chordTimerRef.current) clearTimeout(chordTimerRef.current);
        chordTimerRef.current = setTimeout(() => {
          s.setActiveChord(null);
        }, 1200);
        return;
      }

      if (s.activeChord === "g") {
        if (chordTimerRef.current) clearTimeout(chordTimerRef.current);
        s.setActiveChord(null);

        const key = e.key.toLowerCase();
        if (key === "h") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
        } else if (key === "p") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/projects");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
        } else if (key === "a") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/about");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
        } else if (key === "c") {
          e.preventDefault();
          setGlobalKeyboardNav(true);
          s.router.push("/contact");
          requestAnimationFrame(() => {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (chordTimerRef.current) {
        clearTimeout(chordTimerRef.current);
      }
    };
  }, []);
}

function ChordIndicator({ activeChord }: { activeChord: string | null }) {
  return (
    <AnimatePresence>
      {activeChord && (
        <m.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-1.5 text-xs font-mono shadow-xl backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-foreground">{activeChord}</span>
          <span className="text-muted-foreground">
            then h (Home), p (Projects), a (About), c (Contact)
          </span>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [activeChord, setActiveChord] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { previousPath } = useNavigation();
  const { resolvedTheme, setTheme } = useTheme();

  const openCommandPalette = useCallback(() => {
    setHelpOpen(false);
    setCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, []);

  const openHelp = useCallback(() => {
    setCommandPaletteOpen(false);
    setHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

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

  const shortcutsConfig = useMemo(
    () => ({
      isCommandPaletteOpen,
      isHelpOpen,
      activeChord,
      router,
      pathname,
      previousPath,
      toggleTheme,
      openCommandPalette,
      setCommandPaletteOpen,
      setHelpOpen,
      setActiveChord,
    }),
    [
      isCommandPaletteOpen,
      isHelpOpen,
      activeChord,
      router,
      pathname,
      previousPath,
      toggleTheme,
      openCommandPalette,
    ],
  );

  useGlobalKeyboardShortcuts(shortcutsConfig);
  useScrollLock(isCommandPaletteOpen || isHelpOpen);

  const contextValue = useMemo(
    () => ({
      isCommandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      isHelpOpen,
      openHelp,
      closeHelp,
    }),
    [
      isCommandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      isHelpOpen,
      openHelp,
      closeHelp,
    ],
  );

  return (
    <KeyboardContext.Provider value={contextValue}>
      {children}

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
        onOpenShortcuts={openHelp}
      />
      <KeyboardShortcutsDialog isOpen={isHelpOpen} onClose={closeHelp} />

      {/* Active Chord Micro Indicator */}
      <ChordIndicator activeChord={activeChord} />
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
}
