import { textResponse } from "@/server/route";

export async function GET() {
    return textResponse("Live!");
}
export const dynamic = "force-dynamic";
