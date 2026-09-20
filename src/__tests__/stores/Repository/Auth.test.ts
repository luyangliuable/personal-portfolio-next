import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authReducer, {
    authUser,
    loginUser,
    logout,
    registerUser,
} from "@/stores/Repository/Auth";

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

const jsonResponse = (data: unknown, ok = true) =>
    ({ ok, json: async () => data }) as Response;

describe("auth repository", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.stubGlobal("fetch", vi.fn());
    });

    it("registers a user and stores the resolved username.", async () => {
        const store = makeStore();
        vi.mocked(fetch).mockResolvedValueOnce(
            jsonResponse({ username: "alice" }),
        );
        const action = await store.dispatch(
            registerUser({ username: "alice", password: "pw" } as any),
        );
        expect(registerUser.fulfilled.match(action)).toBe(true);
        expect(store.getState().auth).toMatchObject({
            status: "succeeded",
            user: "alice",
        });
    });

    it("logs a user in and stores the resolved user id.", async () => {
        const store = makeStore();
        vi.mocked(fetch).mockResolvedValueOnce(
            jsonResponse({ userid: "user-1" }),
        );
        const action = await store.dispatch(
            loginUser({ username: "alice", password: "pw" }),
        );
        expect(loginUser.fulfilled.match(action)).toBe(true);
        expect(store.getState().auth.user).toBe("user-1");
    });

    it("fetches the authenticated user.", async () => {
        const store = makeStore();
        vi.mocked(fetch).mockResolvedValueOnce(
            jsonResponse({ username: "bob" }),
        );
        const action = await store.dispatch(authUser());
        expect(authUser.fulfilled.match(action)).toBe(true);
        expect(store.getState().auth.user).toBe("bob");
    });

    it("records api failure messages and network errors.", async () => {
        const store = makeStore();
        vi.mocked(fetch).mockResolvedValueOnce(
            jsonResponse({ message: "bad register" }, false),
        );
        await store.dispatch(registerUser({} as any));
        expect(store.getState().auth).toMatchObject({
            status: "failed",
            error: "bad register",
        });

        vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({}, false));
        await store.dispatch(loginUser({ username: "x", password: "y" }));
        expect(store.getState().auth.error).toBe("Failed to login");

        vi.mocked(fetch).mockRejectedValueOnce(new Error("network"));
        await store.dispatch(authUser());
        expect(store.getState().auth.error).toBe("network");

        vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({}, false));
        await store.dispatch(registerUser({} as any));
        expect(store.getState().auth.error).toBe("Failed to register");

        vi.mocked(fetch).mockResolvedValueOnce(
            jsonResponse({ message: "bad user" }, false),
        );
        await store.dispatch(authUser());
        expect(store.getState().auth.error).toBe("bad user");

        vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({}, false));
        await store.dispatch(authUser());
        expect(store.getState().auth.error).toBe(
            "Failed to fetch user details",
        );
    });

    it("clears the user on logout.", () => {
        const store = makeStore();
        store.dispatch(logout());
        expect(store.getState().auth.user).toBeNull();
    });
});