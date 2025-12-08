# Paras Shenmare Portfolio

A modern, high-performance portfolio website built with Next.js 16, TypeScript, and Tailwind CSS. Featuring smooth animations, a custom design system, and a seamless user experience.

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
    -   Custom preloader with percentage counter
    -   Scroll-triggered reveals
    -   Magnetic navigation buttons
    -   **3D Coverflow Carousel:** Interactive 3D carousel for immersive project showcasing.
    -   **Dynamic Rotating Titles:** Engaging animated text components for headers.
    -   **Experience Timeline:** Structured, responsive timeline for professional history.
-   **🖱️ Custom Cursor:** Interactive custom cursor that reacts to hover states.
-   **📱 Fully Responsive:** Adaptive layout that works perfectly on all devices.
-   **💼 Project Showcase:** Detailed project cards with galleries and tech tags.
-   **📧 Contact Form:** Functional contact form with validation.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Bun** 1.0+ (Recommended)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/shenmareparas/portfolio-nextjs.git
    cd portfolio-nextjs
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Run the development server:**

    ```bash
    bun dev
    ```

4.  **Open locally:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
├── app/                  # App Router pages and layouts
├── components/           # React components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── providers/        # Context providers (Theme, Nav)
│   └── ui/               # Reusable UI components
├── data/                 # Static data (Projects, Config)
├── lib/                  # Utility functions
└── public/               # Static assets
```

## ⚙️ Configuration

You can customize the site metadata and core settings in `data/config.ts`:

-   **Site Metadata:** Title, description, URL.
-   **Personal Info:** Name, role, social links.
-   **Keywords:** SEO keywords.
