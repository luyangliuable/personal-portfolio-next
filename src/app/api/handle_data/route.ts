import { readOptionalJson, textResponse } from "@/server/route";

export async function POST(request: Request) {
    const data = await readOptionalJson(request);
    if (!data) return textResponse("No data received");
    return textResponse(JSON.stringify(data.value));
}
export const dynamic = "force-dynamic";
