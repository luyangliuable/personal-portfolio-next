import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const connect = vi.fn();
const MongoClient = vi.fn(function (this: any, uri: string, options: any) {
    this.uri = uri;
    this.options = options;
    this.connect = connect;
});

vi.mock("mongodb", () => ({ MongoClient }));

describe("mongodb client", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.unstubAllEnvs();
        connect.mockReset();
        MongoClient.mockClear();
        delete (globalThis as any)._mongoClientPromise;
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        delete (globalThis as any)._mongoClientPromise;
    });

    it("throws when the connection string is missing.", async () => {
        vi.stubEnv("MONGODB_URI", "");
        await expect(import("@/lib/mongodb")).rejects.toThrow(
            "Please add your MongoDB URI to .env.local",
        );
    });

    it("creates a client promise in production.", async () => {
        vi.stubEnv("MONGODB_URI", "mongodb://prod");
        vi.stubEnv("NODE_ENV", "production");
        connect.mockResolvedValue("prod-client");

        const mod = await import("@/lib/mongodb");
        await expect(mod.default).resolves.toBe("prod-client");
        expect(MongoClient).toHaveBeenCalledWith("mongodb://prod", {});
    });

    it("caches the client promise globally in development.", async () => {
        vi.stubEnv("MONGODB_URI", "mongodb://dev");
        vi.stubEnv("NODE_ENV", "development");
        connect.mockResolvedValue("dev-client");

        const mod = await import("@/lib/mongodb");
        await expect(mod.default).resolves.toBe("dev-client");
        expect((globalThis as any)._mongoClientPromise).toBeDefined();

        vi.resetModules();
        const mod2 = await import("@/lib/mongodb");
        await expect(mod2.default).resolves.toBe("dev-client");
        expect(MongoClient).toHaveBeenCalledTimes(1);
    });
});