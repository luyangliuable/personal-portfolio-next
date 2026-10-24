import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ObjectId } from "mongodb";
import { getNote, getNotes, insertNote } from "@/server/notes";
import { fakeStore } from "./fakeMongo";

vi.mock("@/server/db", async () => (await import("./fakeMongo")).fakeDb);

const note = { heading: "h", author: "a", file_path: "n.md", body: "" };

async function statusOf(promise: Promise<unknown>): Promise<number> {
    return promise.then(
        () => 200,
        (error) => error.status,
    );
}

function seedNote(overrides: Record<string, unknown> = {}): string {
    const _id = new ObjectId();
    fakeStore.set("Note", [{ _id, ...note, ...overrides }]);
    return _id.toHexString();
}

beforeEach(() => fakeStore.clear());
afterEach(() => vi.unstubAllEnvs());

describe("note service", () => {
    it("stamps the creation date on insert.", async () => {
        await insertNote(note);
        const stored = fakeStore.get("Note")![0];
        expect(stored.date_created).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("lists only active, decodable notes.", async () => {
        fakeStore.set("Note", [
            { _id: new ObjectId(), ...note, heading: "kept" },
            { _id: new ObjectId(), ...note, active: false },
            { _id: new ObjectId(), heading: 1 },
        ]);
        const notes = (await getNotes()) as { heading: string }[];
        expect(notes.map((item) => item.heading)).toEqual(["kept"]);
    });

    it("reads the note body from the notes store.", async () => {
        const root = mkdtempSync(join(tmpdir(), "notes-"));
        writeFileSync(join(root, "n.md"), "# Body");
        vi.stubEnv("NOTES_STORE_LOCATION", root);
        const result = (await getNote(seedNote())) as { body: string };
        expect(result.body).toBe("# Body");
    });

    it("maps note lookup failures to the Rust status codes.", async () => {
        vi.stubEnv("NOTES_STORE_LOCATION", mkdtempSync(join(tmpdir(), "n-")));
        expect(await statusOf(getNote("bad"))).toBe(400);
        expect(await statusOf(getNote("0".repeat(24)))).toBe(500);
        expect(await statusOf(getNote(seedNote({ active: false })))).toBe(404);
        expect(await statusOf(getNote(seedNote()))).toBe(404);
        vi.stubEnv("NOTES_STORE_LOCATION", undefined);
        expect(await statusOf(getNote(seedNote()))).toBe(404);
    });
});
