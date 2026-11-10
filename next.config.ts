import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none';",
  },
];

const nextConfig: NextConfig = {
  compress: true,
  allowedDevOrigins: ["10.71.167.177", "localhost:3000"],
  experimental: {
    inlineCss: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "simple-icons",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-toast",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
