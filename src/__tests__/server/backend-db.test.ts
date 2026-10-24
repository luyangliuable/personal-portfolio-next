import { afterEach, describe, expect, it, vi } from "vitest";
import { getCollection, getDb, mongoUri, RUST_DB_NAME } from "@/server/db";

const mongo = vi.hoisted(() => ({ uris: [] as string[] }));

vi.mock("mongodb", async (importOriginal) => ({
    ...(await importOriginal<typeof import("mongodb")>()),
    MongoClient: vi.fn(function MockClient(uri: string) {
        mongo.uris.push(uri);
        return {
            connect: () =>
                Promise.resolve({
                    db: (name: string) => ({
                        name,
                        collection: (collection: string) => ({ collection }),
                    }),
                }),
        };
    }),
}));

afterEach(() => vi.unstubAllEnvs());

describe("mongo connection", () => {
    it("prefers MONGOURI, then MONGODB_URI, then localhost.", () => {
        vi.stubEnv("MONGOURI", "mongodb://rust");
        vi.stubEnv("MONGODB_URI", "mongodb://next");
        expect(mongoUri()).toBe("mongodb://rust");
        vi.stubEnv("MONGOURI", undefined);
        expect(mongoUri()).toBe("mongodb://next");
        vi.stubEnv("MONGODB_URI", undefined);
        expect(mongoUri()).toBe("mongodb://localhost:27017");
    });

    it("opens one shared client on the Rust database.", async () => {
        vi.stubEnv("MONGOURI", "mongodb://shared");
        expect(await getDb()).toMatchObject({ name: RUST_DB_NAME });
        expect(await getCollection("Post")).toEqual({ collection: "Post" });
        expect(mongo.uris).toEqual(["mongodb://shared"]);
    });
});
