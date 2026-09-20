import { textResponse } from "@/server/route";

export async function POST(request: Request) {
    const raw = await request.text();

    if (!raw) return textResponse("No data received");

    try {
        return textResponse(JSON.stringify(JSON.parse(raw)));
    } catch {
        return textResponse(raw);
    }
}
export const dynamic = "force-dynamic";
