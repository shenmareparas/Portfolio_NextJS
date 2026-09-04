# Project Context: Paras Shenmare Portfolio

This document provides a comprehensive overview of the architecture, file layout, design system, and key technical details of the **Paras Shenmare Portfolio** workspace to help developers and AI agents quickly understand the project structure.

---

## 🎯 Project Overview

This is a modern, high-performance portfolio website built using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It features interactive custom experiences, glassmorphic UI cards, smooth page transitions, preloader states, and support for mobile haptic feedback.

---

## 🚀 Technology Stack

- **Framework**: Next.js 16.3.4 (App Router, Server & Client Components)
- **Runtime & Package Manager**: Bun v1.4.0
- **Styling**: Tailwind CSS v4.3.3 + PostCSS
- **Animations**: Framer Motion v12.43.0
- **Haptic Feedback**: `web-haptics` v0.0.6 (provides tactile/vibration triggers on mobile devices)
- **UI Base & Icons**: Radix UI primitives, Lucide React, and Simple Icons (for tech logos)
- **Form Handling**: React Hook Form + Zod (coupled with Formspree for the contact form)

---

## 📂 Core Folder Structure

```bash
├── .agents/                 # AI Agent instructions, project context, and localized skills
│   ├── AGENTS.md            # Active instructions/rules for AI agents
│   └── project_context.md   # [This File] High-level codebase documentation
│   └── skills/              # Custom agent skills (e.g. web-haptics)
├── app/                     # Next.js App Router routing structure
│   ├── layout.tsx           # Global layout & HTML structure
│   ├── page.tsx             # Homepage containing intro, featured projects, experience, expertise
│   ├── template.tsx         # Framer Motion page entrance animations
│   ├── globals.css          # Core CSS stylesheet importing Tailwind CSS v4
│   ├── robots.ts            # Dynamic robots.txt metadata route
│   ├── sitemap.ts           # Dynamic sitemap.xml indexing pages & projects
│   ├── about/               # About page layout and content
│   ├── contact/             # Contact form page
│   ├── projects/            # Full list of projects & project details page
│   └── qr/                  # Digital QR Business Card / Contact Card
├── components/              # Modular UI components
│   ├── ui/                  # Atom-level reusable controls (Button, Toast, Tooltip, Avatar)
│   ├── layout/              # Navbars, Header, Footer
│   ├── providers/           # ThemeProvider (next-themes) and NavProvider
│   ├── motion/              # Scroll reveals & Framer Motion helper wrappers
│   └── home/                # Homepage sections (Hero, Featured, etc.)
├── data/                    # The source of truth for portfolio content & static state
├── lib/                     # System utilities (cn styling merger, time formatters, etc.)
├── types/                   # Shared TypeScript interface definitions
└── public/                  # Static assets (images, PDFs, documents, icons)
```

---

## ⚙️ Configuration & Data Files (`data/`)

To update or manage the portfolio content, developers should edit the following files rather than modifying page layouts:

1. **[config.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/config.ts)**: Configures global variables like title, keywords (for SEO), metadata, OpenGraph parameters, footer copyright getter, and the Formspree contact form endpoint.
2. **[profile.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/profile.ts)**: Stores general details (name, full name, description/bio blocks, contact email/phone, and path to the resume PDF).
3. **[projects.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/projects.ts)**: A list of projects conforming to `Project` (`types/project.ts`). Supports `galleryLayout: "carousel" | "vertical"` (mobile apps use 3D Coverflow; desktop/macOS/CLI projects use vertical scrolling screenshots with full-screen zoomable lightbox).
4. **[experience.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/experience.ts)** & **[education.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/education.ts)**: Chronological timelines of jobs/internships and universities/certifications.
5. **[skills.tsx](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/skills.tsx)**: Tech logos and skill names grouped by language, web, mobile, backend, and tools.
6. **[testimonials.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/testimonials.ts)**: Endorsements and recommendations.
7. **[expertise.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/expertise.ts)**: Focus areas.

---

## 🛠️ Key UI Features

- **Dual Showcase Media System**:
  - **3D Coverflow Carousel** (`components/ui/coverflow-carousel.tsx`): Interactive 3D phone mockup carousel for mobile applications.
  - **Vertical Screenshot Gallery & Lightbox** (`components/ui/vertical-gallery.tsx`): Dedicated vertical screenshot stream for desktop/macOS and non-mobile projects. Includes a full-screen lightbox powered by a 3-image sliding strip layout (`[prev] [current] [next]` slot system):
    - **Google Photos Mobile Gestures**: Focal pinch-to-zoom (1.0x to 3.0x with gentle ceiling rubber-banding and a hard 1.0x floor), reliable double-tap focal zoom toggle (100% ⇄ 240%) with synthetic mouse event debouncing (`lastTouchDoubleTapTimeRef` 700ms window), calibrated touch slop (16px gesture classification, <24px quick tap displacement, <45px tap proximity), horizontal swipe-to-navigate with distance and velocity thresholds (`velocityX > 0.4`), and vertical swipe-to-dismiss (`dy > 90px`) with progressive backdrop opacity transitions.
    - **Desktop Controls**: Calibrated non-passive mouse wheel zoom, double-click to zoom in/out at cursor, drag-to-pan when scaled, touch-friendly top toolbar controls, and backdrop click to exit.
    - **useReducer Architecture & Sub-component Decomposition**: State transitions (zoom, pan offset, navigation strip indices, animation states, dismiss progress) are orchestrated atomically via `useReducer` (`lightboxReducer`). Interaction logic is decoupled into a dedicated `useLightboxGestures` hook, while the 3-image viewport carousel is encapsulated in `LightboxStrip`, ensuring low component complexity and clean separation of concerns.
    - **Lifecycle, Purity & Memory Management**: Strip transition timers and DOM pointer/wheel/gesture listeners are clean-unmounted with zero event or memory leaks. Pure state updaters, module-scoped static styles (`SLOT_STYLE`), and dynamic `willChange` compositor bindings ensure minimal GPU overhead.
- **Dynamic Title Rotators**: Animated headers that cycle through specialized titles.
- **Haptic Integrations**: The portfolio uses `useWebHaptics` hook in mobile views to trigger haptic feedback during interactive moments:
  - Form submission successes ("success")
  - Input warnings ("warning")
  - Project snaps/selection changes ("selection")
  - Button presses ("medium")
- **Dynamic SEO & Sitemaps**: Dynamic XML sitemap generation (`app/sitemap.ts`) mapping all static pages and dynamic project detail URLs with automated update frequencies and search engine discovery via `app/robots.ts`.

---

## 🏗️ Building, Quality & Audits

- **Dev Server**: `bun dev` (runs on `localhost:3000`)
- **Production Build**: `bun run build`
- **Lint Check**: `bun run lint`
- **React Doctor Audit**: The project is fully optimized and conforms to React Doctor standards with a perfect **100/100** score. Run audit with:
  ```bash
  bun doctor
  # or
  bunx react-doctor@latest . --verbose
  ```

### ⚡ Architectural Optimization Patterns
- **Reduced Motion**: Wrapped in `<MotionConfig reducedMotion="user">` inside `app/layout.tsx` to automatically scale down animations based on user OS settings.
- **Immediate Above-the-Fold LCP Delivery**: Hero content and headings render immediately without blocking `opacity: 0` wrappers to score sub-second FCP and meet Core Web Vitals LCP standards (<2.5s).
- **Google Fonts Swap Strategy**: Fonts configure `display: "swap"` to prevent invisible text during font network streaming.
- **Canonical Standardization**: Absolute and root-relative canonical alternates across all routes to prevent Search Console canonical mismatch flags.
- **Accurate Event & Timer Lifecycles**: All timers (`setTimeout`, `setInterval`) and listeners are strictly garbage-collected using dedicated, return-cleaned `useEffect` blocks (`react-doctor/effect-needs-cleanup`).
- **Dynamic Module Values**: Dynamic values (like copyright year) use property getters instead of module-scope execution to guarantee fresh evaluation per SSR request (`react-doctor/no-impure-call-at-module-scope`).
- **Context Memoization**: React Context values in form primitives and providers are wrapped in `React.useMemo` to eliminate unnecessary subtree redraws (`react-doctor/jsx-no-constructed-context-values`).
- **Transient GPU Acceleration**: Avoids permanent `will-change` CSS classes, relying on Framer Motion's hardware-accelerated transform styles (`react-doctor/no-permanent-will-change`).
- **Fast Refresh State Preservation**: Component files isolate non-component exports to maintain fast refresh hot reloading (`react-doctor/only-export-components`).
- **CSS Grid Transitions**: Collapsible accordion panels leverage CSS grid-row transitions (`0fr -> 1fr`) instead of Framer Motion `height: "auto"` to prevent browser layout recalculation thrashing.
- **Flicker-Free Client Mounts**: Client-only hydration flags utilize `useSyncExternalStore` with module-scope callbacks, bypassing `useState` + `useEffect` hydration flicker.
- **Pure State Updates & Zero Cascading Setters**: State updater functions are side-effect-free and derived during render, eliminating cascading effect re-renders (`react-hooks/set-state-in-effect`).
- **Dynamic Event Listener Registration**: Drag, wheel, and backdrop interaction listeners on viewports are registered in return-cleaned `useEffect` blocks rather than static JSX props (`react-doctor/no-static-element-interactions`).
- **Coordinated State via `useReducer`**: Complex interactive components (like `LightboxModal`) group multiple coupled states into a single reducer with typed transitions, ensuring atomic state updates (`react-doctor/prefer-useReducer`).
- **Modular Sub-component Architecture**: Monolithic views exceeding line count thresholds are split into dedicated sub-components and focused custom hooks to ensure low cyclomatic complexity (`react-doctor/no-giant-component`).
