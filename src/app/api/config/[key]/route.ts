import { getConfigValue, updateConfig } from "@/server/config";
import { errorResponse, readJson, textResponse } from "@/server/route";

interface Context {
    params: { key: string };
}

export async function GET(_request: Request, { params }: Context) {
    try {
        return textResponse(await getConfigValue(params.key));
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PATCH(request: Request, { params }: Context) {
    try {
        const body = await readJson(request);
        return Response.json(await updateConfig(params.key, body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
