import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { postApi } from "@/stores/Repository/Posts";

const makeStore = () =>
    configureStore({
        reducer: { [postApi.reducerPath]: postApi.reducer },
        middleware: (getDefault) => getDefault().concat(postApi.middleware),
    });

const jsonResponse = (data: unknown) =>
    new Response(JSON.stringify(data), {
        status: 200,
        headers: { "content-type": "application/json" },
    });

describe("posts api", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("queries the post list and a single post.", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(jsonResponse([{ _id: "1" }]))
            .mockResolvedValueOnce(jsonResponse({ _id: "2" }));
        vi.stubGlobal("fetch", fetchMock);
        const store = makeStore();

        const list = await store.dispatch(
            postApi.endpoints.getPostList.initiate(),
        );
        expect(list.data).toEqual([{ _id: "1" }]);

        const single = await store.dispatch(
            postApi.endpoints.getPost.initiate("2"),
        );
        expect(single.data).toEqual({ _id: "2" });
        expect((fetchMock.mock.calls[0][0] as Request).url).toContain("posts");
        expect((fetchMock.mock.calls[1][0] as Request).url).toContain(
            "posts/2",
        );
    });
});