# Paras Shenmare Portfolio

A modern, high-performance portfolio website built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Featuring interactive 3D motion, glassmorphic UI components, dynamic SEO sitemaps, mobile haptic feedback, and a certified **100/100 React Doctor** audit score.

I am a passionate Software Developer specializing in **Flutter**, **Android**, and **iOS** development, building accessible, pixel-perfect, and performant mobile and web applications.

---

## 🚀 Tech Stack

-   **Framework:** [Next.js 16.3.4 (App Router)](https://nextjs.org/)
-   **Runtime & Package Manager:** [Bun](https://bun.sh/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
-   **Animations:** [Framer Motion v12](https://www.framer.com/motion/)
-   **Haptics:** [`web-haptics`](https://github.com/loeffel-io/web-haptics)
-   **UI Primitives:** [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/) & [Simple Icons](https://simpleicons.org/)
-   **Forms & Validation:** React Hook Form + Zod (Formspree endpoint)
-   **Analytics:** Vercel Analytics & Speed Insights

---

## ✨ Key Features

-   **🎨 Modern Aesthetics:** Clean glassmorphism, tailored neutral dark/light theme palettes, and crisp typography.
-   **🌓 Dark/Light Mode:** System-aware theme switching powered by `next-themes` with zero layout flashes.
-   **📳 Mobile Haptics:** Integrated `web-haptics` for tactile feedback during button presses, project snaps, form submissions, and warnings on mobile devices.
-   **🗺️ Dynamic SEO & Sitemaps:** Automated XML sitemap generation (`/sitemap.xml`) indexing all static pages and project detail paths alongside configured search bot rules in `/robots.txt`.
-   **🌊 Smooth Animations & Motion:**
    -   **3D Coverflow Carousel:** Interactive carousel with perspective transformations for mobile app project showcases.
    -   **Vertical Screenshot Gallery & Lightbox:** Dedicated vertical scrolling feed with a full-screen 3-image sliding strip lightbox (`[prev] [current] [next]`). Features Google Photos-style mobile gestures (pinch-at-focal-point zoom, 100% ⇄ 240% double-tap zoom toggle with synthetic event debouncing, velocity-aware swipe pagination, and pull-down to dismiss with progressive backdrop fade) alongside desktop mouse wheel zoom, double-click, and drag-to-pan.
    -   **Dynamic Title Rotators:** Cycling header typography.
    -   **Custom Cursor:** Fluid Framer Motion spring physics cursor with hover-target scaling.
    -   **Timeline & Education:** Structured, responsive career, university, and certification timelines.
-   **💳 Digital QR Contact Card:** Dedicated `/qr` page for quick contact sharing and mobile scanning.
-   **📧 Validated Contact Form:** Form validation with Zod schemas and Formspree submission feedback.

---

## 🛠️ Getting Started

### Prerequisites

-   **Bun** (Recommended) or **Node.js** 18+

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/shenmareparas/portfolio-nextjs.git
    cd portfolio-nextjs
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    # or
    npm install
    ```

3.  **Run development server:**
    ```bash
    bun dev
    # or
    npm run dev
    ```

4.  **Open locally:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```bash
├── .agents/                 # AI Agent instructions, project context, and localized skills
│   ├── AGENTS.md            # Active instructions/rules for AI agents
│   └── project_context.md   # High-level codebase architecture documentation
│   └── skills/              # Custom agent skills (e.g. web-haptics)
├── app/                     # Next.js App Router routing structure
│   ├── layout.tsx           # Global layout & HTML structure
│   ├── page.tsx             # Homepage containing hero, featured projects, experience, expertise
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

## ⚙️ Configuration

Portfolio content is centrally managed in the `data/` directory:

-   `data/config.ts`: Site metadata, SEO settings, dynamic copyright getter, and Formspree endpoint.
-   `data/profile.ts`: Bio, contact details, and resume links.
-   `data/projects.ts`: Project showcases, tags, live URLs, GitHub repositories, and gallery media.
-   `data/experience.ts` & `data/education.ts`: Work history, degrees, and certifications.
-   `data/skills.tsx`: Categorized skill stacks and icon mappings.
-   `data/socials.ts`: Social media profiles and contact links.

---

## ⚡ Performance & Quality Audits

-   **React Doctor Certified (100 / 100)**: Conforms to strict code quality, effect cleanup, and render optimization standards.
    ```bash
    bun doctor
    # or
    bunx react-doctor@latest . --verbose
    ```
-   **A11y & Reduced Motion**: Automatically respects user OS accessibility settings via `<MotionConfig reducedMotion="user">`.
-   **Immediate Above-the-Fold LCP**: Zero blocking animation wrappers on above-the-fold hero content ensuring sub-second LCP/FCP.
-   **Flicker-Free SSR Hydration**: Utilizes React 19 `useSyncExternalStore` for client-only state synchronization to prevent hydration flashes.
-   **Guaranteed Lifecycle Cleanup**: Proper garbage collection of all timers (`setTimeout`, `setInterval`) and event listeners with pure side-effect-free state updaters.

---

## 📞 Contact

-   **Email:** [shenmareparas@gmail.com](mailto:shenmareparas@gmail.com)
-   **Website:** [shenmareparas.vercel.app](https://shenmareparas.vercel.app)
-   **LinkedIn:** [linkedin.com/in/shenmareparas](https://linkedin.com/in/shenmareparas)
-   **GitHub:** [@shenmareparas](https://github.com/shenmareparas)

---

© 2026 Paras Shenmare. All rights reserved.

