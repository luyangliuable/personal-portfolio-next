import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const captured: { config?: any } = {};
const memoryDriver = vi.fn(() => ({ type: "memory" }));
const vercelKVDriver = vi.fn((options: any) => ({ type: "vercel", options }));
const createStorage = vi.fn((options: any) => ({ driver: options.driver }));

vi.mock("next-auth", () => ({
    default: (config: any) => {
        captured.config = config;
        return {
            handlers: {},
            auth: vi.fn(),
            signIn: vi.fn(),
            signOut: vi.fn(),
        };
    },
}));
vi.mock("next-auth/jwt", () => ({}));
vi.mock("next-auth/providers/github", () => ({ default: { id: "github" } }));
vi.mock("unstorage", () => ({ createStorage }));
vi.mock("unstorage/drivers/memory", () => ({ default: memoryDriver }));
vi.mock("unstorage/drivers/vercel-kv", () => ({ default: vercelKVDriver }));
vi.mock("@auth/unstorage-adapter", () => ({
    UnstorageAdapter: vi.fn(() => "adapter"),
}));

describe("auth configuration", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.unstubAllEnvs();
        captured.config = undefined;
        memoryDriver.mockClear();
        vercelKVDriver.mockClear();
        createStorage.mockClear();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it("builds the NextAuth config with local storage and runs its callbacks.", async () => {
        vi.stubEnv("VERCEL", "");
        await import("@/auth");

        expect(memoryDriver).toHaveBeenCalled();
        const config = captured.config;
        expect(config.adapter).toBe("adapter");
        expect(config.providers).toEqual([{ id: "github" }]);
        expect(config.basePath).toBe("/auth");
        expect(config.session).toEqual({ strategy: "jwt" });
        expect(config.experimental).toEqual({ enableWebAuthn: true });

        expect(
            config.callbacks.authorized({
                request: { nextUrl: { pathname: "/middleware-example" } },
                auth: null,
            }),
        ).toBe(false);
        expect(
            config.callbacks.authorized({
                request: { nextUrl: { pathname: "/" } },
                auth: { user: "x" },
            }),
        ).toBe(true);

        expect(
            config.callbacks.jwt({
                token: { name: "old" },
                trigger: "update",
                session: { user: { name: "new" } },
            }),
        ).toEqual({ name: "new" });
        expect(
            config.callbacks.jwt({
                token: { name: "x" },
                account: { provider: "keycloak", access_token: "at" },
            }),
        ).toEqual({ name: "x", accessToken: "at" });
        expect(config.callbacks.jwt({ token: { name: "x" } })).toEqual({
            name: "x",
        });

        const session = { user: {} } as any;
        expect(
            await config.callbacks.session({
                session,
                token: { accessToken: "at" },
            }),
        ).toBe(session);
        expect(session.accessToken).toBe("at");

        const plain = { user: {} } as any;
        expect(
            await config.callbacks.session({ session: plain, token: {} }),
        ).toBe(plain);
    });

    it("uses the vercel KV driver when running on vercel.", async () => {
        vi.stubEnv("VERCEL", "1");
        vi.stubEnv("AUTH_KV_REST_API_URL", "https://kv");
        vi.stubEnv("AUTH_KV_REST_API_TOKEN", "token");
        await import("@/auth");

        expect(vercelKVDriver).toHaveBeenCalledWith({
            url: "https://kv",
            token: "token",
            env: false,
        });
        expect(createStorage).toHaveBeenCalled();
    });
});