import { beforeEach, describe, expect, it, vi } from "vitest";
import { ObjectId } from "mongodb";
import { createUser, login, verifySession } from "@/server/users";
import { hashPassword } from "@/server/user";
import { fakeStore } from "./fakeMongo";

vi.mock("@/server/db", async () => (await import("./fakeMongo")).fakeDb);

const passwordHash = hashPassword("secret");

function seedUser(overrides: Record<string, unknown> = {}) {
    const user = {
        _id: new ObjectId(),
        username: "bob",
        password: passwordHash,
        email: "bob@example.com",
        first_name: "Bob",
        last_name: "Smith",
        session_token: null,
        ...overrides,
    };
    fakeStore.set("User", [user]);
    return user;
}

async function statusOf(promise: Promise<unknown>): Promise<number> {
    return promise.then(
        () => 200,
        (error) => error.status,
    );
}

beforeEach(() => fakeStore.clear());

describe("session verification", () => {
    it("rejects users that have no session token.", async () => {
        const user = seedUser();
        const userid = user._id.toHexString();
        expect(
            await statusOf(verifySession({ userid, session_token: "null" })),
        ).toBe(401);
        expect(await statusOf(verifySession({ userid }))).toBe(422);
    });

    it("accepts only the stored token.", async () => {
        const userid = seedUser({ session_token: "t1" })._id.toHexString();
        expect(await verifySession({ userid, session_token: "t1" })).toBe(
            "Session token is valid",
        );
        expect(
            await statusOf(verifySession({ userid, session_token: "t2" })),
        ).toBe(401);
        expect(
            await statusOf(
                verifySession({ userid: "bad", session_token: "t1" }),
            ),
        ).toBe(400);
        const unknown = new ObjectId().toHexString();
        expect(
            await statusOf(
                verifySession({ userid: unknown, session_token: "t1" }),
            ),
        ).toBe(404);
    });
});

describe("login", () => {
    it("prefers email whenever it is present.", async () => {
        seedUser();
        const byEmail = login({
            email: "",
            username: "bob",
            password: "secret",
        });
        expect(await statusOf(byEmail)).toBe(401);
        const session = await login({
            username: "bob",
            password: "secret",
            email: null,
        });
        expect(session.session_token).toMatch(/^[0-9a-f-]{36}$/);
        expect(fakeStore.get("User")![0].session_token).toBe(
            session.session_token,
        );
    });

    it("maps credential failures to Rust status codes.", async () => {
        seedUser();
        expect(
            await statusOf(login({ username: "bob", password: "nope" })),
        ).toBe(401);
        expect(
            await statusOf(login({ username: "amy", password: "secret" })),
        ).toBe(401);
        expect(await statusOf(login({ password: "secret" }))).toBe(500);
        expect(await statusOf(login({ username: "bob" }))).toBe(422);
        seedUser({ password: "plain-text" });
        expect(await statusOf(login({ username: "bob", password: "x" }))).toBe(
            500,
        );
    });
});

describe("registration", () => {
    it("stores Rust-shaped users and validates required fields.", async () => {
        const session = await createUser({
            username: "amy",
            password: "pw",
            email: "amy@example.com",
            first_name: "Amy",
            last_name: "Lee",
            role: "Admin",
        });
        const stored = fakeStore.get("User")![0];
        expect(session.userid).toBe((stored._id as ObjectId).toHexString());
        expect(stored.role).toBe("User");
        expect(stored.middle_name).toBeNull();
        expect(stored.password).not.toBe("pw");
        expect(typeof stored.session_token_created_date).toBe("string");
        expect(
            await statusOf(createUser({ username: "x", password: "p" })),
        ).toBe(422);
    });
});
