import { textResponse } from "@/server/route";

export function GET() {
    return textResponse("Hello, world!");
}
export const dynamic = "force-dynamic";
