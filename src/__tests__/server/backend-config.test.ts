import { beforeEach, describe, expect, it, vi } from "vitest";
import { ObjectId } from "mongodb";
import { getConfigValue, insertConfig, updateConfig } from "@/server/config";
import { insertMessage } from "@/server/messages";
import { fakeStore } from "./fakeMongo";

vi.mock("@/server/db", async () => (await import("./fakeMongo")).fakeDb);

beforeEach(() => fakeStore.clear());

describe("config service", () => {
    it("returns the value for a key and 404s for unknown keys.", async () => {
        await insertConfig({ key: "theme", value: "dark" });
        expect(await getConfigValue("theme")).toBe("dark");
        await expect(getConfigValue("missing")).rejects.toMatchObject({
            status: 404,
        });
    });

    it("replaces a config entry by id.", async () => {
        const _id = new ObjectId();
        fakeStore.set("Config", [{ _id, key: "theme", value: "dark" }]);
        const result = await updateConfig(_id.toHexString(), {
            key: "theme",
            value: "light",
        });
        expect(result).toMatchObject({ matchedCount: 1, modifiedCount: 1 });
        expect(await getConfigValue("theme")).toBe("light");
    });
});

describe("message service", () => {
    it("stores user messages with a creation date and message type.", async () => {
        const result = await insertMessage({ name: "Amy", description: "hi" });
        const stored = fakeStore.get("Message")![0];
        expect(result).toEqual({
            insertedId: { $oid: (stored._id as ObjectId).toHexString() },
        });
        expect(stored.message_type).toBe("USERMESSAGE");
        expect(stored.date_created).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
});
