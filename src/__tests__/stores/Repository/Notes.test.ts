import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notesApi } from "@/stores/Repository/Notes";

const makeStore = () =>
    configureStore({
        reducer: { [notesApi.reducerPath]: notesApi.reducer },
        middleware: (getDefault) => getDefault().concat(notesApi.middleware),
    });

const jsonResponse = (data: unknown) =>
    new Response(JSON.stringify(data), {
        status: 200,
        headers: { "content-type": "application/json" },
    });

describe("notes api", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("queries the note list and a single note.", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(jsonResponse([{ _id: "1" }]))
            .mockResolvedValueOnce(jsonResponse({ _id: "2" }));
        vi.stubGlobal("fetch", fetchMock);
        const store = makeStore();

        const list = await store.dispatch(
            notesApi.endpoints.getNoteList.initiate(),
        );
        expect(list.data).toEqual([{ _id: "1" }]);

        const single = await store.dispatch(
            notesApi.endpoints.getNote.initiate("2"),
        );
        expect(single.data).toEqual({ _id: "2" });
        expect((fetchMock.mock.calls[0][0] as Request).url).toContain("note");
        expect((fetchMock.mock.calls[1][0] as Request).url).toContain(
            "note/2",
        );
    });
});