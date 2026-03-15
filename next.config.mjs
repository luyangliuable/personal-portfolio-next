/** @type {import("next").NextConfig} */
import MillionLint from "@million/lint";

const nextConfig = {
    images: {
        formats: ["image/webp", "image/avif"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "llcode.tech",
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
        optimizePackageImports: ["gsap", "@gsap/react", "react-icons"],
    },
};

export default MillionLint.next({ rsc: true })(nextConfig);
