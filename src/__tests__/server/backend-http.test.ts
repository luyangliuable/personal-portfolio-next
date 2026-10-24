import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { streamUpstream } from "@/server/proxy";
import {
    errorResponse,
    readJsonBody,
    sessionCookieOptions,
    textResponse,
} from "@/server/route";
import { HttpError } from "@/server/http";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("upstream proxy", () => {
    it("streams the upstream status and content type through.", async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response("<svg/>", {
                status: 203,
                headers: { "content-type": "image/svg+xml" },
            }),
        );
        vi.stubGlobal("fetch", fetchMock);
        const response = await streamUpstream("https://x.test/a.svg");
        expect(fetchMock).toHaveBeenCalledWith("https://x.test/a.svg", {
            method: "GET",
        });
        expect(response.status).toBe(203);
        expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
        expect(await response.text()).toBe("<svg/>");
    });

    it("defaults the content type and maps failures to 400 and 500.", async () => {
        const upstream = new Response(new Uint8Array([1, 2]));
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(upstream));
        const response = await streamUpstream("https://x.test/raw");
        expect(response.headers.get("Content-Type")).toBe(
            "application/octet-stream",
        );
        await expect(streamUpstream("")).rejects.toMatchObject({ status: 400 });
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
        await expect(streamUpstream("https://x.test")).rejects.toMatchObject({
            status: 500,
        });
    });
});

describe("route helpers", () => {
    it("builds plain text responses.", async () => {
        const response = textResponse("Live!", 201);
        expect(response.status).toBe(201);
        expect(response.headers.get("Content-Type")).toBe("text/plain");
        expect(await response.text()).toBe("Live!");
    });

    it("hides unexpected errors behind a bare 500.", () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(errorResponse(new HttpError(418)).status).toBe(418);
        expect(errorResponse(new Error("boom")).status).toBe(500);
        expect(log).toHaveBeenCalledOnce();
    });

    it("rejects JSON bodies over Rocket's 1 MiB limit with 413.", async () => {
        const big = new Request("https://x.test", {
            method: "POST",
            body: `"${"a".repeat(1024 * 1024)}"`,
        });
        await expect(readJsonBody(big)).rejects.toMatchObject({ status: 413 });
    });

    it("scopes session cookies to /api with SameSite=Strict.", () => {
        expect(sessionCookieOptions()).toEqual({
            path: "/api",
            sameSite: "strict",
        });
    });
});

describe("api middleware", () => {
    const request = (method: string) =>
        new NextRequest("http://localhost:3000/api/posts", {
            method,
            headers: { origin: "http://localhost:3000" },
        });

    it("answers CORS preflight requests with 204.", () => {
        const response = middleware(request("OPTIONS"));
        expect(response.status).toBe(204);
        expect(
            response.headers.get("Access-Control-Allow-Origin"),
        ).toBeTruthy();
    });

    it("adds CORS headers to other API requests.", () => {
        const response = middleware(request("GET"));
        expect(response.headers.get("x-middleware-next")).toBe("1");
        expect(
            response.headers.get("Access-Control-Allow-Origin"),
        ).toBeTruthy();
    });
});
