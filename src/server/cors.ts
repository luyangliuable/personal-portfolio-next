const PRODUCTION_ORIGINS = [
    "http://llcode.tech",
    "https://llcode.tech",
    "http://170.64.250.107",
    "https://170.64.250.107",
];

const DEVELOPMENT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:6006",
    "https://localhost:3000",
    "http://localhost:3001",
];

/** Mirrors the Rust CORS fairing in src/config/cors.rs. */
export function buildCorsHeaders(
    origin: string | null,
    environment: string | undefined = process.env.ENVIRONMENT,
): Record<string, string> {
    const isProduction = environment === "production";
    const allowedOrigins = isProduction
        ? PRODUCTION_ORIGINS
        : DEVELOPMENT_ORIGINS;

    const headers: Record<string, string> = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true",
    };

    if (origin && allowedOrigins.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
    } else if (!isProduction) {
        headers["Access-Control-Allow-Origin"] = "*";
    }

    return headers;
}
