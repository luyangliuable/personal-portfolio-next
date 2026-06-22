import React from "react";
const h = React.createElement;
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Notes from "@/page/NotePage/NotePage";

vi.mock("@/components/HeroHeader/HeroHeader", () => ({
    default: ({ children }: any) => h("div", null, children),
}));
vi.mock("@/components/BlogPostGraphics/BlogPostGraphics", () => ({
    default: () => h("div"),
}));
vi.mock("@/components/EmojIcon/EmojIcon", () => ({ default: () => h("span") }));
vi.mock("@/page/SkeletonPage/SkeletonPage", () => ({
    default: () => h("div", null, "Loading"),
}));
vi.mock("@/components/Accordion/Accordion", () => {
    const Accordion: any = ({ children }: any) => h("div", null, children);
    Accordion.Item = ({ children, heading }: any) =>
        h("section", null, h("h2", null, heading), children);
    return { default: Accordion };
});
vi.mock("@/components/Card/Card", () => ({
    default: ({ authorImage, heading, link }: any) =>
        h(
            "article",
            { "data-testid": "note-card", "data-link": link },
            h("h3", null, heading),
            h("span", null, authorImage),
        ),
}));

describe("Notes", () => {
    const createNote = (overrides: Record<string, unknown> = {}) => ({
        _id: { $oid: "note-id" },
        heading: "Random Note",
        author: "Lu",
        body: "Body",
        date_created: "2026-06-20",
        date_last_modified: "2026-06-21",
        reading_time_minutes: 1,
        in_progress: false,
        tags: [],
        image: { $oid: "image-id" },
        ...overrides,
    });

    it("groups notes by their first tag and falls back to random for untagged notes.", async () => {
        render(
            h(Notes, {
                title: "Notes",
                description: "Desc",
                content: [
                    createNote(),
                    createNote({
                        _id: { $oid: "react-1" },
                        heading: "React One",
                        tags: ["react"],
                    }),
                    createNote({
                        _id: { $oid: "react-2" },
                        heading: "React Two",
                        tags: ["react"],
                    }),
                ] as any,
            }),
        );

        await waitFor(() =>
            expect(screen.getByText("random (1)")).toBeInTheDocument(),
        );
        expect(screen.getByText("react (2)")).toBeInTheDocument();
        expect(
            screen.getByText("Random Note").closest("article"),
        ).toHaveAttribute(
            "data-link",
            "/digital-chronicles/coding-note/note-id",
        );
        expect(screen.getAllByTestId("note-card")[0]).toHaveTextContent(
            "65817ae96c73ceb16ba51731",
        );
    });
});
