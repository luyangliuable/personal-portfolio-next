import { textResponse } from "@/server/route";

export async function GET() {
    const markdown = process.env.MARKDOWN_POSTS_STORE_LOCATION;
    const image = process.env.IMAGE_STORE_LOCATION;

    const result =
        (markdown
            ? `markdown store location: ${markdown}\n`
            : "No markdown store location found\n") +
        (image
            ? `image store location: ${image}\n`
            : "No image store location found\n") +
        `Environment: ${process.env.ENVIRONMENT ?? "None"}\n`;

    return textResponse(result);
}
export const dynamic = "force-dynamic";
