import { textResponse } from "@/server/route";

export async function GET() {
    return textResponse("Hello, world!");
}
export const dynamic = "force-dynamic";
