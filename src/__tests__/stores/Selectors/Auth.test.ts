import { describe, expect, it } from "vitest";
import {
    selectAuthError,
    selectAuthStatus,
    selectCurrentUser,
    selectIsLoggedIn,
} from "@/stores/Selectors/Auth";

const state = (overrides: any = {}) =>
    ({
        auth: { status: "succeeded", user: "alice", error: null, ...overrides },
    }) as any;

describe("auth selectors", () => {
    it("exposes login status, current user, status and error from state.", () => {
        expect(selectIsLoggedIn(state())).toBe(true);
        expect(selectIsLoggedIn(state({ status: "idle" }))).toBe(false);
        expect(selectCurrentUser(state())).toBe("alice");
        expect(selectAuthStatus(state())).toBe("succeeded");
        expect(selectAuthError(state({ error: "boom" }))).toBe("boom");
    });
});