import { textResponse } from "@/server/route";

export function GET() {
    return textResponse("Live!");
}
export const dynamic = "force-dynamic";
