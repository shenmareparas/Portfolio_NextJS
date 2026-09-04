import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,
    allowedDevOrigins: ["10.71.167.177", "localhost:3000"],
    turbopack: {
        root: process.cwd(),
    },
};

export default nextConfig;
