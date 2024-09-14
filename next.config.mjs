/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        // Add support for importing images
        config.module.rules.push({
            test: /\.(png|jpe?g|gif|svg|webp)$/i, // Regex for matching image file types
            type: 'asset/resource', // This handles images as resources
        });

        return config;
    },
    images: {
        // Configure the domains you want to allow images from, if needed
        domains: [], // Add domains here if you need to load images from external sources
        // Optionally specify the allowed image formats
        formats: ['image/avif', 'image/webp'],
    },
};

export default nextConfig;
