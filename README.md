# Paras Shenmare Portfolio

A modern, high-performance portfolio website built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Featuring interactive 3D and lightbox showcases, glassmorphic UI components, dynamic SEO sitemaps, mobile haptic feedback, WCAG AA light/dark contrast, and a **React Doctor** (`0` issues) + **Lighthouse 100** Performance/Accessibility/SEO setup.

I am a Software Developer specializing in **Flutter**, **Android**, and **iOS** development, building accessible, pixel-perfect, and performant mobile and web applications.

---

## Tech Stack

- **Framework:** [Next.js 16.4.6 (App Router)](https://nextjs.org/) & React 19.3.1
- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Styling:** [Tailwind CSS v4.3.5](https://tailwindcss.com/) + PostCSS
- **Animations:** [Framer Motion v12](https://www.framer.com/motion/) (`LazyMotion` + `domAnimation`)
- **Haptics:** [`web-haptics`](https://github.com/lochie/web-haptics) (`0.0.6`)
- **UI Primitives:** [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & [Simple Icons](https://simpleicons.org/)
- **Forms & Validation:** React Hook Form + Zod (`zod/mini` v4) via Formspree
- **Analytics:** Vercel Analytics & Speed Insights

---

## Key Features

- **Modern Aesthetics & WCAG AA Contrast:** Clean glassmorphism, calibrated neutral light/dark theme palettes (`--muted-foreground: #636363` light / `#a3a3a3` dark), theme-aware `{ light, dark }` project accent colors (`>= 4.70:1` contrast across all 11 projects), and high-resolution app icons (`favicon.ico`, `icon.png`, `apple-icon.png`).
- **Dark/Light Mode:** System-aware theme switching powered by `next-themes` with zero layout flashes and dynamic `{ light, dark }` screenshot switching across project showcases.
- **Command Palette & Global Keyboard System:** Instant `⌘K` / `Ctrl+K` / `/` Spotlight search palette indexing pages, projects, social profiles, and actions—lazy-loaded on first open via `next/dynamic`. Supports Vim-style navigation chords (`g h`, `g p`, `g a`, `g c`), numeric route jumps (`1`–`4`), theme toggle (`t`), scroll-to-top (`r`), and an adaptive shortcuts dialog (`?`). The desktop header features an adaptive spotlight pill (`[ Search... ⌘K ]` on macOS, `[ Search... Ctrl+K ]` on Windows/PC) with `aria-keyshortcuts` and hover/focus route prefetching.
- **Adaptive Cross-Platform Experience:** SSR-safe platform hooks (`useIsMac`, `useIsMobile`, `useIsWindows`) built on `useSyncExternalStore` adapt shortcut badges and form hints without hydration mismatches.
- **Fluid Card Grid Navigation & Spotlight Dimming:** Accessible keyboard `Tab` traversal across project cards with spotlight dimming via `useCardGridNav`, synthetic mousemove suppression during scroll, and automatic focus handoff to `#main-content` after closing modals or running route chords.
- **Mobile Haptics:** Integrated `web-haptics` via `useMobileHaptics` (supporting `HapticInput`, `TriggerOptions`, and `WebHapticsOptions` on `(max-width: 768px)` viewports) for tactile feedback across mobile buttons, accordions, carousel snaps, `/qr` actions, and form validation.
- **Dynamic SEO & Social Metadata:** Automated XML sitemap (`/sitemap.xml`), `/robots.txt`, and per-project Open Graph / Twitter `share` metadata (`ProjectShareInfo`).
- **Dual Showcase Media System:**
  - **3D Coverflow Carousel:** Interactive 3D phone mockup carousel modeled after the iPhone 18 Pro Max (`19.5:9` aspect ratio, micro-thin borders, brushed titanium frame) with gesture physics and theme switching.
  - **Vertical Screenshot Gallery & Lightbox:** Vertical scrolling feed with a full-screen 3-slot lightbox (`useReducer`, `useLightboxGestures`, `LightboxStrip`, `LightboxControls`) for macOS, CLI, and web apps (_Live Wallpaper Engine for macOS_, _Play Store AI Console_, _NEXU5_), supporting mobile pinch-to-zoom, debounced double-tap zoom, swipe pagination, pull-down dismiss, mouse-wheel zoom, and drag-to-pan.
- **Timeline, Education & Dual-Column Credentials:** Work timeline and education alongside a balanced dual-column Credentials & Recognition section (`components/about/credentials-section.tsx`) pairing 13 certifications (6 visible + `inert`-guarded CSS Grid expander) and 6 achievements.
- **Accessible Testimonials & Expertise:** Native mobile snap-scroll / desktop CSS `Marquee` (`repeat={2}` with `aria-hidden` + `inert` cloned track, SVG `<symbol>`/`<use>` star reuse, and Pause/Resume control), plus an `aria-expanded` / `inert`-guarded Expertise accordion.
- **Digital QR Contact Card & Contact Form:** Dedicated `/qr` digital business card with vCard download, plus a `zod/mini`-validated contact form at `/contact`.

---

## Getting Started

### Prerequisites

- **Bun** (Recommended; project scripts and pre-commit conventions target Bun) or **Node.js** 18+

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/shenmareparas/Portfolio_NextJS.git
   cd Portfolio_NextJS
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Run development server:**

   ```bash
   bun dev
   ```

4. **Open locally:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```bash
├── .agents/                 # AI Agent instructions, project context, and localized skills
│   ├── AGENTS.md            # Active instructions/rules for AI agents
│   ├── project_context.md   # High-level codebase architecture documentation
│   └── skills/              # Custom agent skills (react-doctor, web-haptics)
├── app/                     # Next.js App Router routing structure
│   ├── layout.tsx           # Global layout, fonts, providers, analytics
│   ├── favicon.ico          # Browser tab favicon (32x32)
│   ├── icon.png             # PNG app icon (512x512)
│   ├── apple-icon.png       # Apple Touch Icon (180x180)
│   ├── page.tsx             # Homepage: Hero, Featured Projects, Expertise, Testimonials
│   ├── template.tsx         # Client-navigation-only Framer Motion page transition
│   ├── globals.css          # Core stylesheet (Tailwind CSS v4, theme tokens, animations)
│   ├── robots.ts            # Dynamic robots.txt metadata route
│   ├── sitemap.ts           # Dynamic sitemap.xml indexing pages & projects
│   ├── about/               # About page (Bio, Skills, Experience, Education, Credentials)
│   ├── contact/             # Contact form page
│   ├── projects/            # Full project list & dynamic [slug] project details page
│   └── qr/                  # Digital QR Business Card / Contact Card
├── components/              # Modular UI components
│   ├── ui/                  # Reusable controls (Button, Toast, CommandPalette, KeyboardShortcuts, CustomCursor, Preloader, Marquee, SimpleIcon, CoverflowCarousel, VerticalGallery)
│   ├── layout/              # Header, Footer, ClientLayout
│   ├── providers/           # ThemeProvider, NavigationProvider, LoadingProvider, KeyboardProvider
│   ├── motion/              # Client-navigation-aware FadeIn wrapper
│   ├── home/                # Homepage sections (FeaturedProjects, Expertise, Testimonials)
│   ├── projects/            # ProjectCard, ProjectsClient
│   ├── experience/          # ExperienceTimeline
│   ├── contact/             # ContactForm, ContactCard
│   └── about/               # CredentialsSection, CertificationCard, AchievementCard
├── hooks/                   # Custom React hooks (useCardGridNav, useMobileHaptics, useScrollLock, useIsWindows, useToast)
├── data/                    # Source of truth for portfolio content & static configuration
├── lib/                     # System utilities (`cn` class merger)
├── types/                   # Shared TypeScript interface & type definitions
├── next.config.ts           # Inline CSS, optimizePackageImports, and HTTP security headers
└── public/                  # Static assets (images, PDFs, documents, icons)
```

---

## Configuration

Portfolio content is centrally managed in the `data/` directory:

- `data/config.ts`: Site metadata, SEO settings, dynamic copyright getter, and Formspree endpoint.
- `data/profile.ts`: Bio, contact details, and resume links.
- `data/projects.ts`: Project showcases, tags, live URLs, GitHub repositories, custom `share` metadata, theme-aware `{ light, dark }` `accentColor` tokens, and gallery media.
- `data/experience.ts` & `data/education.ts`: Work history, degrees, certifications, and structured honors/achievements.
- `data/skills.tsx`: Categorized skill stacks and icon mappings.
- `data/socials.tsx`: Social media profiles and contact links.
- `data/testimonials.ts` & `data/expertise.ts`: Client/user testimonials and core expertise items.

---

## Performance & Quality Audits

- **React Doctor & Lint Clean:** Conforms to strict code quality, hook cleanup, and complexity standards (`react-doctor` `0.9.22`):
  ```bash
  bun fmt
  bunx tsc --noEmit
  bun run lint
  bun run doctor -- --yes --verbose
  ```
- **Production Build:** Configured with `experimental.inlineCss: true` and `optimizePackageImports` in `next.config.ts`:
  ```bash
  bun run build
  # or in Bun-only environments without node:
  bun --bun node_modules/.bin/next build --webpack
  ```
- **Zero SSR `opacity: 0` LCP Blocking:** `app/template.tsx`, `FadeIn`, and `ProjectCard` skip initial opacity-0 animations on direct SSR loads (`previousPath === null`) so above-the-fold hero content paints immediately.
- **Lazy Overlays, CSS Preloader & Lean Bundles:** `CommandPalette`, `KeyboardShortcutsDialog`, and `CustomCursorInner` load lazily via `next/dynamic(..., { ssr: false })`; `Preloader` runs purely on CSS `scaleX` keyframes; `ContactForm` uses `zod/mini`; header links prefetch on hover/focus; homepage cards receive trimmed `ProjectSummary` payloads with lazy image loading.
- **Off-Screen Deferral, Tailwind v4 & Accessible UX:** `Testimonials` applies `content-visibility: auto`, `motion-safe:scroll-smooth`, Tailwind v4 `bg-linear-*` fades, SVG `<symbol>`/`<use>` reuse, `repeat={2}` marquee with `inert` cloned tracks, and a WCAG 2.2.2 Pause/Resume toggle; decorative SVGs (`SimpleIconComponent` without `label`, `JavaIcon`) use `aria-hidden="true"` without `role="img"`; desktop/mobile `<nav>` elements have distinct `aria-label` landmarks; `CommandPalette` uses `text-base` (`16px`) input sizing to prevent mobile zoom; `/qr` `<main>` uses `min-h-dvh`.
- **Security Headers (`next.config.ts`):** Sends `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Cross-Origin-Opener-Policy`, `Strict-Transport-Security` (`includeSubDomains; preload`), `Permissions-Policy`, and `Content-Security-Policy: frame-ancestors 'none'`.

---

## Contact

- **Email:** [shenmareparas@gmail.com](mailto:shenmareparas@gmail.com)
- **Website:** [shenmareparas.vercel.app](https://shenmareparas.vercel.app)
- **LinkedIn:** [linkedin.com/in/shenmareparas](https://linkedin.com/in/shenmareparas)
- **GitHub:** [@shenmareparas](https://github.com/shenmareparas)

---

© 2026 Paras Shenmare. All rights reserved.
