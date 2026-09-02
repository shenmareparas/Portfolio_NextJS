# Agent Guidelines & Rules

This document outlines the development guidelines, constraints, and conventions for AI agents working on the **Paras Shenmare Portfolio** codebase.

## 🛠️ Stack & Architecture Constraints

1. **Framework**: Next.js 16 (App Router), React 19, TypeScript, and Bun as the package manager and runner.
2. **Styling**: Tailwind CSS v4. Ensure configuration is done via CSS variables or standard Tailwind classes. Avoid using deprecated Tailwind v3 config structures or styles.
3. **Animations**: Framer Motion. Keep animations smooth, subtle, and responsive.
4. **Haptics**: `web-haptics` (local plugin in `.agents/skills/web-haptics`) should be used for interactive elements targeting mobile viewports (e.g., buttons, toggles, form submissions). Refer to [web-haptics SKILL.md](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/.agents/skills/web-haptics/SKILL.md) for trigger details.
5. **UI Components**: Built using Shadcn UI primitives (`components/ui/`) and Radix UI.

---

## 📂 Codebase & Folder Conventions

- **Pages and Routing**: All routing is under `app/` using Next.js App Router.
- **Components**:
  - `components/ui/`: Low-level reusable UI components (buttons, inputs, tooltips, dialogs, `coverflow-carousel.tsx`, `vertical-gallery.tsx`).
  - `components/layout/`: Global structure components (Header, Footer, Navbar).
  - `components/providers/`: Client-side provider contexts (Theme, Nav).
  - `components/motion/`: Framer-motion helper components.
  - Page-specific components reside in folders like `components/home/`, `components/projects/`, `components/experience/`, etc.
- **Data-Driven Configuration**:
  - **CRITICAL**: Do NOT hardcode personal details, experience, education, or project lists directly in the page components. Always read from or modify files in the `data/` directory:
    - [config.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/config.ts): Site SEO and metadata.
    - [profile.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/profile.ts): Bio, contact details, and resume links.
    - [projects.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/projects.ts): List of featured and personal projects. Supports `galleryLayout: "carousel" | "vertical"` where mobile app projects use 3D Coverflow (`"carousel"`) by default and desktop/macOS/CLI projects use `"vertical"` scrolling with a full-screen zoomable lightbox.
    - [experience.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/experience.ts) & [education.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/education.ts): Timelines.
    - [skills.tsx](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/skills.tsx): Categorized developer skills using Lucide and Simple Icons.
    - [testimonials.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/testimonials.ts): User/client feedback.
    - [expertise.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/expertise.ts): Core domain expertise list.
- **Types**: All TypeScript interfaces and types must be placed in `types/`. Cross-reference types before declaring new ones.

---

## 🎨 Styling & Design Guidelines

- **Theme Support**: The site is light/dark system-aware. Ensure all new components use Tailwind's dark-mode classes (e.g., `dark:bg-zinc-950`).
- **Typography & Colors**:
  - Use high-quality curated color palettes (primarily Zinc/Neutral greys, with vibrant, tailored accent gradients).
  - Ensure visual excellence, premium aesthetics (glassmorphism/backdrop-filters where appropriate), and high contrast (WCAG standards).
- **Responsive Design**: Ensure mobile-first designs. Never assume a desktop width.
- **Form Validation**: Always pair React Hook Form with Zod for contact or input validation.

---

## 🚀 Key Commands

- **Run Dev Server**: `bun dev`
- **Build Production**: `bun run build`
- **Lint Code**: `bun run lint`
- **Install Dependencies**: `bun install`

---

## ⚡ Performance & Quality Guidelines (React Doctor Audited)

1. **Avoid Layout Property Animations & Broad Transitions**:
   - Do not animate layout-affecting properties (like `height`, `width`, `top`, `left`, etc.) directly via Framer Motion. Instead use GPU-composited CSS transforms (`scaleX`, `scaleY`) and CSS Grid transitions (`grid-template-rows: 0fr -> 1fr`).
   - Avoid `transition-all`. Always specify targeted transitions (e.g., `transition-colors`, `transition-opacity`, `transition-transform`, or `transition-[border-color,box-shadow,transform]`) to prevent browser layout reflow jank.
2. **Prevent Timer and Event Listener Leaks**: Every `setTimeout`, `setInterval`, or DOM event listener registered inside a `useEffect` must return a corresponding cleanup function (`clearTimeout`, `clearInterval`, or `removeEventListener`) to prevent memory leaks and background state updates on unmounted components.
3. **SSR-Safe Mounting without Flicker**: Do not use `useState` + `useEffect` mount flags just to detect client-side rendering. Use React 19's `useSyncExternalStore` with stable module-level selectors to ensure client-only mount state syncs in a single commit, eliminating hydration flashes.
4. **Stable Callback Dependencies**: When using hooks like `useCallback` or `useMemo`, avoid depending on complex/derived variables when only a primitive is needed. Extract the primitive boolean or string in the render scope (e.g., `isDark`, `themeToSet`) and depend on that to prevent redundant hook recreation.
5. **Interactive Element Accessibility**: Never attach click, keydown, or drag handlers directly as React props on static elements (`div`) or semantic non-interactive elements (`section`, `li`). For custom drag-scrollable containers, register listeners dynamically inside a `useEffect` using `.addEventListener()` to bypass static checker violations while ensuring full control over event teardown.
6. **Zod 4 Schema Standards**: Use top-level format builders (e.g., `z.email()`, `z.uuid()`, `z.iso.date()`) rather than chained methods on `z.string()` (e.g., `z.string().email()`) for forward compatibility.
7. **Immediate Above-the-Fold LCP Delivery**: Never wrap above-the-fold hero content (`h1`, `h2`, hero CTA buttons) inside client animation wrappers initialized with `opacity: 0` (e.g. `<FadeIn>`). The hero elements must render immediately in the initial SSR commit to prevent artificial LCP and FCP delays. Below-the-fold sections may use scroll-triggered animations.
8. **Font Swap Strategy**: Google Fonts configured via `next/font/google` must explicitly specify `display: "swap"` to prevent font-blocking delays.
9. **Consistent Canonical URLs**: Maintain strict canonical formatting across `app/layout.tsx`, individual page routes, and `app/sitemap.ts` to prevent Google Search Console duplicate/mismatch warnings.

