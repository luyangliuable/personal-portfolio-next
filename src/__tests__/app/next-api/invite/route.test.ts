import { beforeEach, describe, expect, it, vi } from "vitest";

const { findOne, insertOne } = vi.hoisted(() => ({
    findOne: vi.fn(),
    insertOne: vi.fn(),
}));

vi.mock("@/lib/mongodb", () => ({
    default: Promise.resolve({
        db: () => ({ collection: () => ({ findOne, insertOne }) }),
    }),
}));

import { POST } from "@/app/next-api/invite/route";

function request(body: unknown) {
    return { json: async () => body } as never;
}

describe("invite route POST", () => {
    beforeEach(() => {
        findOne.mockReset();
        insertOne.mockReset();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("rejects a request without a survey", async () => {
        const response = await POST(request({}));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: "Survey body is required",
        });
        expect(insertOne).not.toHaveBeenCalled();
    });

    it("rejects a survey that already exists", async () => {
        findOne.mockResolvedValueOnce({ _id: "existing" });

        const response = await POST(request({ survey: "one" }));

        expect(response.status).toBe(409);
        await expect(response.json()).resolves.toEqual({
            error: "Survey already exists",
        });
        expect(insertOne).not.toHaveBeenCalled();
    });

    it("inserts a new survey", async () => {
        findOne.mockResolvedValueOnce(null);
        insertOne.mockResolvedValueOnce({ insertedId: "new-id" });

        const response = await POST(request({ survey: "two" }));

        expect(response.status).toBe(201);
        await expect(response.json()).resolves.toEqual({
            message: "Survey added successfully",
            id: "new-id",
        });
        expect(insertOne).toHaveBeenCalledWith({
            survey: "two",
            createdAt: expect.any(Date),
        });
    });

    it("returns 500 when the request cannot be processed", async () => {
        const broken = {
            json: async () => {
                throw new Error("invalid json");
            },
        } as never;

        const response = await POST(broken);

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({
            error: "An error occurred while processing your request",
        });
    });
});