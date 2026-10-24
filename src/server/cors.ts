import { apiOrigin } from "../config/api";

const PRODUCTION_IP_ORIGINS = [
    "http://170.64.250.107",
    "https://170.64.250.107",
];

/** The site's own origin comes from NEXT_PUBLIC_API_BASE_URL. */
function productionOrigins(): string[] {
    const siteOrigin = apiOrigin(process.env.NEXT_PUBLIC_API_BASE_URL ?? "");
    return siteOrigin
        ? [siteOrigin, ...PRODUCTION_IP_ORIGINS]
        : PRODUCTION_IP_ORIGINS;
}

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
        ? productionOrigins()
        : DEVELOPMENT_ORIGINS;

    const headers: Record<string, string> = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true",
    };

    // A disallowed Origin gets no header at all; the wildcard is only for
    // requests without an Origin, outside production.
    if (origin !== null) {
        if (allowedOrigins.includes(origin)) {
            headers["Access-Control-Allow-Origin"] = origin;
        }
    } else if (!isProduction) {
        headers["Access-Control-Allow-Origin"] = "*";
    }

    return headers;
}
