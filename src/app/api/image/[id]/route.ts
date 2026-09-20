import { NextResponse } from "next/server";
import { getImage, updateImage } from "@/server/images";
import { errorResponse, readJson } from "@/server/route";

interface Context {
    params: { id: string };
}

export async function GET(request: Request, { params }: Context) {
    try {
        const compression = Number(
            new URL(request.url).searchParams.get("compression") ?? 100,
        );
        const { contentType, buffer } = await getImage(params.id, compression);
        return new NextResponse(buffer, {
            status: 200,
            headers: { "Content-Type": contentType },
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PUT(request: Request, { params }: Context) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await updateImage(params.id, body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
