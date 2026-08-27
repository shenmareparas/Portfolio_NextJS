# Project Context: Paras Shenmare Portfolio

This document provides a comprehensive overview of the architecture, file layout, design system, and key technical details of the **Paras Shenmare Portfolio** workspace to help developers and AI agents quickly understand the project structure.

---

## 🎯 Project Overview

This is a modern, high-performance portfolio website built using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It features interactive custom experiences, glassmorphic UI cards, smooth page transitions, preloader states, and support for mobile haptic feedback.

---

## 🚀 Technology Stack

- **Framework**: Next.js 16.3.3 (App Router, Server & Client Components)
- **Runtime & Package Manager**: Bun v1.4.0
- **Styling**: Tailwind CSS v4.3.3 + PostCSS
- **Animations**: Framer Motion v12.43.0
- **Haptic Feedback**: `web-haptics` v0.0.6 (provides tactile/vibration triggers on mobile devices)
- **UI Base & Icons**: Radix UI primitives, Lucide React, and Simple Icons (for tech logos)
- **Form Handling**: React Hook Form + Zod (coupled with Formspree for the contact form)

---

## 📂 Core Folder Structure

```bash
├── .agents/                 # AI Agent instructions and localized skills
│   ├── AGENTS.md            # Active instructions/rules for AI agents
│   └── project_context.md   # [This File] High-level codebase documentation
│   └── skills/              # Custom agent skills (e.g. web-haptics)
├── app/                     # Next.js App Router routing structure
│   ├── layout.tsx           # Global layout & HTML structure
│   ├── page.tsx             # Homepage containing intro, featured projects, experience, expertise
│   ├── template.tsx         # Framer Motion page entrance animations
│   ├── globals.css          # Core CSS stylesheet importing Tailwind CSS v4
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

1. **[config.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/config.ts)**: Configures global variables like title, keywords (for SEO), metadata, OpenGraph parameters, and the Formspree contact form endpoint.
2. **[profile.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/profile.ts)**: Stores general details (name, full name, description/bio blocks, contact email/phone, and path to the resume PDF).
3. **[projects.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/projects.ts)**: A list of projects. Each project conforms to the `Project` type interface, supporting titles, slug-based details, links to App Store/Play Store/GitHub, and gallery assets.
4. **[experience.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/experience.ts)** & **[education.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/education.ts)**: Chronological timelines of jobs/internships and universities/certifications.
5. **[skills.tsx](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/skills.tsx)**: Tech logos and skill names grouped by language, web, mobile, backend, and tools.
6. **[testimonials.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/testimonials.ts)**: Endorsements and recommendations.
7. **[expertise.ts](file:///Users/parasshenmare/Developer/nextjs_projects/portfolio_nextjs/data/expertise.ts)**: Focus areas.

---

## 🛠️ Key UI Features

- **3D Coverflow Carousel**: Interactive project navigation leveraging Framer Motion.
- **Dynamic Title Rotators**: Animated headers that cycle through specialized titles.
- **Haptic Integrations**: The portfolio uses `useWebHaptics` hook in mobile views to trigger haptic feedback during interactive moments:
  - Form submission successes ("success")
  - Input warnings ("warning")
  - Project snaps/selection changes ("selection")
  - Button presses ("medium")

---

## 🏗️ Building, Quality & Audits

- **Dev Server**: `bun dev` (runs on `localhost:3000`)
- **Production Build**: `bun run build`
- **Lint Check**: `bun run lint`
- **React Doctor Audit**: The project is fully optimized and conforms to React Doctor standards with a perfect **100/100** score. Run audit with:
  ```bash
  bunx react-doctor@latest . --verbose
  ```

### ⚡ Architectural Optimization Patterns
- **Reduced Motion**: Wrapped in `<MotionConfig reducedMotion="user">` inside `app/layout.tsx` to automatically scale down animations based on user OS settings.
- **Immediate Above-the-Fold LCP Delivery**: Hero content and headings render immediately without blocking `opacity: 0` wrappers to score sub-second FCP and meet Core Web Vitals LCP standards (<2.5s).
- **Google Fonts Swap Strategy**: Fonts configure `display: "swap"` to prevent invisible text during font network streaming.
- **Canonical Standardization**: Absolute and root-relative canonical alternates across all routes to prevent Search Console canonical mismatch flags.
- **Accurate Event Lifecycles**: All timers (`setTimeout`) and listeners are properly garbage-collected using returned effect cleanup functions.
- **CSS Grid Transitions**: Collapsible accordion panels leverage CSS grid-row transitions (`0fr -> 1fr`) instead of Framer Motion `height: "auto"` to prevent browser layout recalculation thrashing.
- **Flicker-Free Client Mounts**: Client-only hydration flags utilize `useSyncExternalStore` with module-scope callbacks, bypassing `useState` + `useEffect` hydration flicker.
