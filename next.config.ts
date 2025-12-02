import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,
    turbopack: {
        root: process.cwd(),
    },
};

export default nextConfig;
