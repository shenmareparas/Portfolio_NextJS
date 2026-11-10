# Project Context: Paras Shenmare Portfolio

This document provides a comprehensive overview of the architecture, file layout, design system, and key technical details of the **Paras Shenmare Portfolio** workspace to help developers and AI agents quickly understand the project structure.

---

## Project Overview

This is a modern, high-performance portfolio website built using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It features interactive 3D and lightbox showcases, glassmorphic UI cards, SSR-first Core Web Vitals optimization, WCAG AA light/dark contrast compliance, and mobile haptic feedback.

---

## Technology Stack

- **Framework**: Next.js 16.4.6 (App Router, Server & Client Components, `experimental.inlineCss`)
- **Runtime & Package Manager**: Bun v1.4.4
- **UI Library**: React 19.3.1
- **Styling**: Tailwind CSS v4.3.5 + PostCSS
- **Animations**: Framer Motion v12.43.0 (`LazyMotion` + `domAnimation`)
- **Haptic Feedback**: `web-haptics` v0.0.6 (provides tactile/vibration triggers on mobile devices)
- **UI Base & Icons**: Radix UI primitives, Lucide React, and Simple Icons (`simple-icons/icons`)
- **Form Handling**: React Hook Form + Zod (`zod/mini` v4.6.7, coupled with Formspree for the contact form)
- **Telemetry**: Vercel Analytics & Speed Insights

---

## Core Folder Structure

```bash
├── .agents/                 # AI Agent instructions, project context, and localized skills
│   ├── AGENTS.md            # Active instructions/rules for AI agents
│   ├── project_context.md   # [This File] High-level codebase documentation
│   └── skills/              # Custom agent skills (react-doctor, web-haptics)
├── app/                     # Next.js App Router routing structure
│   ├── layout.tsx           # Global layout, fonts (display: "swap"), providers, analytics
│   ├── favicon.ico          # Legacy & standard browser tab favicon (32x32)
│   ├── icon.png             # High-resolution PNG app icon (512x512)
│   ├── apple-icon.png       # Apple Touch Icon for iOS/macOS (180x180)
│   ├── page.tsx             # Homepage: Hero, Featured Projects (ProjectSummary), Expertise, Testimonials
│   ├── template.tsx         # Client-navigation-only Framer Motion page transitions (SSR renders at opacity: 1)
│   ├── globals.css          # Core CSS stylesheet (Tailwind CSS v4, light/dark tokens, preloader & defer utilities)
│   ├── robots.ts            # Dynamic robots.txt metadata route
│   ├── sitemap.ts           # Dynamic sitemap.xml indexing pages & projects
│   ├── about/               # About page (Bio, Skills, Experience Timeline, Education, Credentials)
│   ├── contact/             # Contact form page
│   ├── projects/            # Full project list & dynamic [slug] project details page
│   └── qr/                  # Digital QR Business Card / Contact Card
├── components/              # Modular UI components
│   ├── ui/                  # Reusable controls (Button, Toast, CommandPalette, KeyboardShortcuts, CustomCursor, Preloader, Marquee, SimpleIcon, CoverflowCarousel, VerticalGallery)
│   ├── layout/              # Header (Minimalist Spotlight Pill + SSR desktop/mobile navs), Footer, ClientLayout
│   ├── providers/           # ThemeProvider, NavigationProvider, LoadingProvider, KeyboardProvider
│   ├── motion/              # Client-navigation-aware FadeIn reveal wrapper
│   ├── home/                # Homepage sections (FeaturedProjects, Expertise, Testimonials)
│   ├── projects/            # ProjectCard, ProjectsClient
│   ├── experience/          # ExperienceTimeline
│   ├── contact/             # ContactForm, ContactCard
│   └── about/               # CredentialsSection, CertificationCard, AchievementCard
├── hooks/                   # Custom React hooks (useCardGridNav, useMobileHaptics, useScrollLock, useIsWindows, useToast)
├── data/                    # Source of truth for portfolio content & static configuration
├── lib/                     # Utilities (`cn` class merger)
├── types/                   # Shared TypeScript interface & type definitions
├── next.config.ts           # Inline CSS, optimizePackageImports, and HTTP security headers
└── public/                  # Static assets (images, PDFs, documents, icons)
```

---

## Configuration & Data Files (`data/`)

To update or manage portfolio content, edit files in `data/` rather than hardcoding values in page components:

1. **[config.ts](../data/config.ts)**: Global title, SEO keywords, metadata, OpenGraph defaults, dynamic copyright getter, and the Formspree contact form endpoint.
2. **[profile.ts](../data/profile.ts)**: Personal details (name, full name, description/bio blocks, contact email/phone, and resume PDF path).
3. **[projects.ts](../data/projects.ts)**: List of 11 projects conforming to `Project` (`types/project.ts`, with `ProjectSummary` used on homepage cards). Supports `galleryLayout: "carousel" | "vertical"` (mobile apps use 3D Coverflow; desktop/macOS/CLI/web console projects such as _Live Wallpaper Engine for macOS_, _Play Store AI Console_, and _NEXU5_ use vertical scrolling screenshots with a zoomable lightbox), standardized cover banners (`image: "/project/<slug>/banner.webp"`), custom social sharing metadata (`share?: ProjectShareInfo`), theme-aware gallery pairs (`GalleryItem = string | { light: string; dark: string }`), and theme-aware `{ light, dark }` `accentColor` shades calibrated to meet `>= 4.70:1` WCAG AA contrast in both themes.
4. **[experience.ts](../data/experience.ts)** & **[education.ts](../data/education.ts)**: Chronological work history, degrees, 13 certifications, and 6 achievements.
5. **[skills.tsx](../data/skills.tsx)**: Tech logos and skill names grouped by language, mobile, web, backend, and tools (with `aria-hidden="true"` on decorative SVGs).
6. **[socials.tsx](../data/socials.tsx)**: Social media profiles and icons (`simple-icons/icons` + Lucide).
7. **[testimonials.ts](../data/testimonials.ts)**: User reviews and endorsements.
8. **[expertise.ts](../data/expertise.ts)**: Core focus areas rendered as an accessible accordion.

---

## Key UI Features

- **Command Palette & Global Keyboard System**:
  - **Lazy-Loaded Overlays (`components/providers/keyboard-provider.tsx`)**: `CommandPalette` (`⌘K` / `Ctrl+K` / `/`) and `KeyboardShortcutsDialog` (`?`) are dynamically imported via `next/dynamic(..., { ssr: false })` on first open, keeping initial JS payloads minimal while preserving `AnimatePresence` exit transitions.
  - **Global Navigation Chords**: Vim-style chords (`g h` Home, `g p` Projects, `g a` About, `g c` Contact), numeric jumps (`1`–`4`), theme toggle (`t`), and scroll-to-top (`r`).
  - **Minimalist Spotlight Pill (`components/layout/header.tsx`)**: Desktop header pill displaying `[ Search... ⌘K ]` on macOS and `[ Search... Ctrl+K ]` on Windows/PC with `aria-keyshortcuts` and `aria-hidden="true"` on the `<kbd>` badge so visible `"Search..."` text matches its accessible name verbatim (WCAG 2.5.3). Hidden on mobile viewports.
  - **SSR-Rendered Navigation Landmarks**: Both `<nav aria-label="Primary">` (desktop) and `<nav aria-label="Mobile">` (mobile bottom tabs) render directly in SSR HTML without `createPortal`, using `prefetch={false}` with `router.prefetch` on hover/focus.
  - **Platform-Aware Form Hints (`components/contact/contact-form.tsx`)**: Uses `zod/mini` for schema validation and adapts textarea shortcut hints across mobile, Windows (`Ctrl+Enter`), and macOS (`⌘+Enter`).
  - **SSR-Safe Platform Detection (`hooks/use-is-windows.ts`)**: `useIsMac`, `useIsMobile`, and `useIsWindows` use `useSyncExternalStore` for flicker-free OS/device detection without hydration flashes.
- **Card Grid Traversal & Spotlight Dimming System**:
  - **`useCardGridNav` Hook (`hooks/use-card-grid-nav.ts`)**: Synchronizes mouse hover and keyboard focus states across project card grids (`/projects` and featured section). When any card is focused or hovered, inactive siblings dim uniformly.
  - **Stationary Mouse Suppression**: Ignores synthetic `mousemove`/`mouseenter` events dispatched when cards scroll beneath a stationary cursor (>3px physical displacement threshold), ensuring keyboard `Tab` traversal is uninterrupted.
  - **Direct Focus Handoff**: Dismissing the Command Palette or triggering a route chord anchors focus to `<main id="main-content" tabIndex={-1}>` so the next `Tab` lands directly on page content.
  - **Lazy Keyboard-Aware Custom Cursor (`components/ui/custom-cursor.tsx` & `custom-cursor-inner.tsx`)**: Dynamically imports `CursorInner` only when `(pointer: fine)` matches and physical mouse movement occurs, auto-hiding during keyboard navigation.
- **Dual Showcase Media System**:
  - **3D Coverflow Carousel (`components/ui/coverflow-carousel.tsx`)**: Interactive 3D phone mockup carousel modeled after the iPhone 18 Pro Max form factor (`19.5:9` aspect ratio, micro-thin borders, brushed titanium frame).
  - **Vertical Screenshot Gallery & Lightbox (`components/ui/vertical-gallery.tsx`)**: Vertical screenshot stream for desktop/macOS, CLI, and web apps with a full-screen 3-slot lightbox (`useReducer` + `useLightboxGestures` + `LightboxStrip` + `LightboxControls`) supporting focal pinch-to-zoom, debounced double-tap zoom, swipe navigation, pull-down dismiss, mouse-wheel zoom, and drag-to-pan.
- **Credentials & Recognition Dual-Column System (`components/about/credentials-section.tsx`)**:
  - Balanced 2-column grid displaying 6 initial certifications (with 7 more inside an `inert`-guarded `grid-template-rows` expander) alongside 6 achievements, using direct `simple-icons/icons` imports.
- **Testimonials Carousel & Marquee (`components/home/testimonials.tsx` & `components/ui/marquee.tsx`)**:
  - Mobile native snap-scroll carousel (`motion-safe:scroll-smooth`) and desktop CSS marquee (`repeat={2}` with `aria-hidden="true"` and `inert` on the cloned track), Tailwind v4 `bg-linear-to-r`/`bg-linear-to-l` edge fades, SVG `<symbol>` + `<use>` star icons, conditional `AvatarImage`, off-screen `content-visibility: auto`, and a keyboard-accessible Pause/Resume button (WCAG 2.2.2).
- **Haptic Integrations**: `useMobileHaptics` (`hooks/use-mobile-haptics.ts`) wraps `web-haptics` with `useSyncExternalStore` on `(max-width: 768px)`, forwards `WebHapticsOptions`, `HapticInput`, and `TriggerOptions` with stable destructured callbacks, and powers mobile tactile triggers across interactive components and `/qr` (`app/qr/qr-content.tsx`).
- **Dynamic SEO & Sitemaps**: Automated XML sitemap (`app/sitemap.ts`), `robots.ts`, and per-project Open Graph / Twitter `share` metadata (`app/projects/[slug]/page.tsx`).

---

## Building, Quality, & Audits

- **Dev Server**: `bun dev` (runs on `localhost:3000`)
- **Production Build**: `bun run build` (or `bun --bun node_modules/.bin/next build --webpack` when `node` is not installed)
- **Format**: `bun fmt`
- **Type Check**: `bunx tsc --noEmit`
- **Lint Check**: `bun run lint`
- **React Doctor Audit**: `react-doctor` v0.9.22 scans `0` issues across all 81 files (plus optional UI design audits via `design`):
  ```bash
  bun run doctor -- --yes --verbose
  # or in Bun-only environments without node:
  bun --bun node_modules/.bin/react-doctor --yes --verbose
  bun --bun node_modules/.bin/react-doctor design --verbose
  ```

### Architectural Optimization Patterns

- **Immediate Above-the-Fold LCP Delivery**: `app/template.tsx`, `FadeIn`, and `ProjectCard` skip `opacity: 0` on initial SSR (`previousPath === null`) so hero headings and text paint immediately without hydration or animation render delay.
- **Inline Critical CSS & Package Tree-Shaking**: `next.config.ts` enables `experimental.inlineCss: true` (removing render-blocking CSS requests) and `optimizePackageImports` alongside direct `simple-icons/icons` imports.
- **HTTP Security Headers (`next.config.ts`)**: Configures `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `Permissions-Policy`, and `Content-Security-Policy: frame-ancestors 'none'`.
- **Image Priority Discipline**: Below-the-fold homepage project cards omit `priority`, and `/projects` caps `priority` preloads at the first two cards (`index < 2`).
- **Compositor-Only Preloader & Reduced Motion**: `Preloader` uses pure CSS `@keyframes` (`scaleX` + `opacity`) without JS timers; `<MotionConfig reducedMotion="user">` and targeted `@media (prefers-reduced-motion: reduce)` CSS rules respect user preferences without global `0.01ms` hacks.
- **Off-Screen Layout Deferral & SVG Reuse**: `.defer-offscreen-section` applies `content-visibility: auto; contain-intrinsic-size: auto 560px` to off-screen `Testimonials`, and star icons reuse a single `<symbol>`.
- **WCAG AA Contrast, Mobile Ergonomics & Accessibility Tree Hygiene**: Light (`--muted-foreground: #636363`) and dark (`--muted-foreground: #a3a3a3`) tokens, all 11 theme-aware project accents (`>= 4.70:1`), `aria-hidden="true"` decorative SVGs (`SimpleIconComponent`, `JavaIcon`), distinct `<nav>` landmark labels, `aria-keyshortcuts`, `inert` on collapsed/cloned regions, `text-base` (`16px`) search input sizing to prevent mobile iOS zoom (`CommandPalette`), and `min-h-dvh` viewport sizing on `/qr` ensure full accessibility compliance.
- **Google Fonts Swap & SSR-Safe Hydration**: `Inter` and `JetBrains_Mono` configure `display: "swap"`; client-only checks and OS/media detection use `useSyncExternalStore` with pure state updaters and clean `useEffect` teardowns.
- **Safe-Area Inset Hero Calibration**: Homepage hero calibrates `env(safe-area-inset-bottom, 0px)` offsets and vertical height breakpoints (`@media(max-height:500px)` / `@media(max-height:750px)`).
