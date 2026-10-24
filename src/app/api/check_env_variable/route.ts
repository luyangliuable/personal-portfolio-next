import { textResponse } from "@/server/route";

const STORE_LOCATIONS = [
    ["markdown", "MARKDOWN_POSTS_STORE_LOCATION"],
    ["image", "IMAGE_STORE_LOCATION"],
    ["note", "NOTES_STORE_LOCATION"],
] as const;

export async function GET() {
    let result = "";
    for (const [name, variable] of STORE_LOCATIONS) {
        const location = process.env[variable];
        result +=
            location === undefined
                ? `No ${name} store location found\n`
                : `${name} store location: ${location}\n`;
    }
    result += `Environment: ${process.env.ENVIRONMENT ?? "None"}\n`;

    return textResponse(result);
}
export const dynamic = "force-dynamic";
