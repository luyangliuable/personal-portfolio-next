/** @type {import("next").NextConfig} */
module.exports = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // Allows images from any HTTPS domain
            },
            {
                protocol: "http",
                hostname: "**", // Allows images from any HTTP domain
            },
        ],
    },
};
