# Paras Shenmare Portfolio

A modern, high-performance portfolio website built with Next.js 16, TypeScript, and Tailwind CSS. Featuring smooth animations, a custom design system, and a seamless user experience.

I am a passionate Software Developer specializing in **Flutter**, **Android**, and **iOS** development, building accessible, pixel-perfect, and performant mobile applications.

## 🚀 Tech Stack

-   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/) & [Simple Icons](https://simpleicons.org/)
-   **Forms:** React Hook Form + Zod
-   **Analytics:** Vercel Analytics

## ✨ Key Features

-   **🎨 Modern Design:** Clean, minimalist UI with a focus on typography and whitespace.
-   **🌓 Dark/Light Mode:** System-aware theme switching with smooth transitions.
-   **⚡ High Performance:** Optimized with Next.js Server Components and dynamic imports.
-   **🌊 Smooth Animations:**
    -   Page transition effects
    -   Custom preloader
    -   Scroll-triggered reveals
    -   **3D Coverflow Carousel:** Interactive 3D carousel for immersive project showcasing.
    -   **Dynamic Rotating Titles:** Engaging animated text components for headers.
    -   **Experience Timeline:** Structured, responsive timeline for professional history.
    -   **Education & Certifications:** Dedicated sections for academic background, degrees, and professional certifications.
-   **🖱️ Custom Cursor:** Interactive custom cursor that reacts to hover states.
-   **📱 Fully Responsive:** Adaptive layout that works perfectly on all devices.
-   **💼 Project Showcase:** Detailed project cards with galleries and tech tags.
-   **📧 Contact Form:** Functional contact form with validation.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js** 18+
-   **Bun** 1.0+ (Optional but recommended)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/shenmareparas/portfolio-nextjs.git
    cd portfolio-nextjs
    ```

2.  **Install dependencies:**

    Using Bun (Recommended):

    ```bash
    bun install
    ```

    Using npm:

    ```bash
    npm install
    ```

    Using yarn:

    ```bash
    yarn install
    ```

    Using pnpm:

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    bun dev
    # or
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  **Open locally:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshenmareparas%2Fportfolio-nextjs)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 📂 Project Structure

```bash
├── app/                  # App Router pages and layouts
├── components/           # React components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── providers/        # Context providers (Theme, Nav)
│   └── ui/               # Reusable UI components
├── data/                 # Static data (Projects, Config)
├── lib/                  # Utility functions
├── public/               # Static assets
└── types/                # TypeScript interfaces
```

## ⚙️ Configuration

You can fully customize the portfolio content by modifying the files in the `data/` directory:

-   `data/config.ts`: Site metadata, SEO settings, and global config.
-   `data/profile.ts`: Personal bio, contact details, and resume link.
-   `data/projects.ts`: Your portfolio projects with descriptions, links, and tags.
-   `data/experience.ts`: Work experience history and timeline.
-   `data/education.ts`: Academic background, degrees, and certifications.
-   `data/skills.tsx`: Technical skills categories and icons.
-   `data/socials.tsx`: Social media profiles and navigation links.

## 📞 Contact

-   **Email:** [shenmareparas@gmail.com](mailto:shenmareparas@gmail.com)
-   **Twitter:** [@parasshenmare](https://twitter.com/parasshenmare)

---

© 2026 Paras Shenmare. All rights reserved.
