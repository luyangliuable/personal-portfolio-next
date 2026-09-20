import { describe, expect, it } from "vitest";
import { store } from "@/stores/store";

describe("redux store", () => {
    it("registers the auth, posts and notes reducers.", () => {
        const state = store.getState();
        expect(Object.keys(state)).toEqual(
            expect.arrayContaining(["auth", "postApi", "notesApi"]),
        );
        expect(typeof store.dispatch).toBe("function");
    });
});