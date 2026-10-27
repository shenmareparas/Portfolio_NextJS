"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X, Keyboard, ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useIsWindows } from "@/hooks/use-is-windows";

interface ShortcutGroup {
  category: string;
  items: {
    keys: string[];
    description: string;
  }[];
}

const MAC_SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: "Navigation",
    items: [
      { keys: ["g", "h"], description: "Go to Home page" },
      { keys: ["g", "p"], description: "Go to Projects" },
      { keys: ["g", "a"], description: "Go to About page" },
      { keys: ["g", "c"], description: "Go to Contact page" },
      { keys: ["1", "4"], description: "Quick jump to pages 1–4" },
      { keys: ["⌫", "Esc"], description: "Back to Projects (on project page)" },
      { keys: ["r"], description: "Scroll to top of page" },
    ],
  },
  {
    category: "Global Actions",
    items: [
      { keys: ["⌘", "K"], description: "Open Command Palette / Search" },
      { keys: ["/"], description: "Quick search focus" },
      { keys: ["t"], description: "Toggle Light / Dark theme" },
      { keys: ["?"], description: "Show this shortcuts cheat sheet" },
      { keys: ["Esc"], description: "Close modal / Clear focus" },
    ],
  },
  {
    category: "Galleries & Lightbox",
    items: [
      { keys: ["←", "→"], description: "Previous / Next screenshot" },
      { keys: ["Enter"], description: "Open image in full lightbox" },
      { keys: ["+", "-"], description: "Zoom in / Zoom out in viewer" },
      { keys: ["0"], description: "Reset lightbox zoom" },
    ],
  },
  {
    category: "Forms & Controls",
    items: [
      { keys: ["Tab"], description: "Advance to next interactive element" },
      { keys: ["⇧", "Tab"], description: "Move to previous element" },
      { keys: ["⌘", "↵"], description: "Submit contact form" },
    ],
  },
];

const WINDOWS_SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: "Navigation",
    items: [
      { keys: ["g", "h"], description: "Go to Home page" },
      { keys: ["g", "p"], description: "Go to Projects" },
      { keys: ["g", "a"], description: "Go to About page" },
      { keys: ["g", "c"], description: "Go to Contact page" },
      { keys: ["1", "4"], description: "Quick jump to pages 1–4" },
      { keys: ["⌫", "Esc"], description: "Back to Projects (on project page)" },
      { keys: ["r"], description: "Scroll to top of page" },
    ],
  },
  {
    category: "Global Actions",
    items: [
      { keys: ["Ctrl", "K"], description: "Open Command Palette / Search" },
      { keys: ["/"], description: "Quick search focus" },
      { keys: ["t"], description: "Toggle Light / Dark theme" },
      { keys: ["?"], description: "Show this shortcuts cheat sheet" },
      { keys: ["Esc"], description: "Close modal / Clear focus" },
    ],
  },
  {
    category: "Galleries & Lightbox",
    items: [
      { keys: ["←", "→"], description: "Previous / Next screenshot" },
      { keys: ["Enter"], description: "Open image in full lightbox" },
      { keys: ["+", "-"], description: "Zoom in / Zoom out in viewer" },
      { keys: ["0"], description: "Reset lightbox zoom" },
    ],
  },
  {
    category: "Forms & Controls",
    items: [
      { keys: ["Tab"], description: "Advance to next interactive element" },
      { keys: ["⇧", "Tab"], description: "Move to previous element" },
      { keys: ["Ctrl", "↵"], description: "Submit contact form" },
    ],
  },
];

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsDialog({
  isOpen,
  onClose,
}: KeyboardShortcutsDialogProps) {
  const isWindows = useIsWindows();
  const shortcutGroups = isWindows
    ? WINDOWS_SHORTCUT_GROUPS
    : MAC_SHORTCUT_GROUPS;
  const dialogRef = useRef<HTMLDivElement>(null);

  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overscroll-contain">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md overscroll-contain touch-none"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden overscroll-contain"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Keyboard className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Navigate the portfolio entirely without touching the mouse
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close shortcuts dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Groups */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain">
              {shortcutGroups.map((group) => (
                <div key={group.category} className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {group.category}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <div
                        key={item.description}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3.5 py-2.5 text-sm"
                      >
                        <span className="text-foreground/90 text-xs">
                          {item.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((key, i) => (
                            <span
                              key={`${item.description}-${key}-${i}`}
                              className="flex items-center gap-1"
                            >
                              {i > 0 && item.keys.length > 2 && (
                                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/60" />
                              )}
                              <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-background px-1.5 font-mono text-[11px] font-medium text-foreground shadow-xs">
                                {key}
                              </kbd>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3 text-xs text-muted-foreground">
              <span>
                Tip: Press{" "}
                <kbd className="font-mono px-1 py-0.5 rounded border border-border bg-background">
                  ?
                </kbd>{" "}
                anywhere to toggle this cheat sheet
              </span>
              <kbd className="font-mono px-1.5 py-0.5 rounded border border-border bg-background">
                ESC to close
              </kbd>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
