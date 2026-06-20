import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Notes from "@/page/NotePage/NotePage";

vi.mock("@/components/HeroHeader/HeroHeader", () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/BlogPostGraphics/BlogPostGraphics", () => ({
    default: () => <div />,
}));
vi.mock("@/components/EmojIcon/EmojIcon", () => ({ default: () => <span /> }));
vi.mock("@/page/SkeletonPage/SkeletonPage", () => ({
    default: () => <div>Loading</div>,
}));
vi.mock("@/components/Accordion/Accordion", () => {
    const Accordion: any = ({ children }: any) => <div>{children}</div>;
    Accordion.Item = ({ children }: any) => <section>{children}</section>;
    return { default: Accordion };
});
vi.mock("@/components/Card/Card", () => ({
    default: ({ authorImage }: any) => (
        <div data-testid="note-card">{authorImage}</div>
    ),
}));

describe("Notes", () => {
    it("passes the default author image id to note cards", async () => {
        render(
            <Notes
                title="Notes"
                description="Desc"
                content={[
                    {
                        _id: { $oid: "1" },
                        heading: "Post",
                        author: "Lu",
                        body: "",
                        date_created: "2026-06-20",
                        date_last_modified: "2026-06-20",
                        reading_time_minutes: 1,
                        in_progress: false,
                        tags: ["random"],
                        image: { $oid: "image-id" },
                    } as any,
                ]}
            />,
        );
        await waitFor(() =>
            expect(screen.getByTestId("note-card")).toBeInTheDocument(),
        );
        expect(screen.getByTestId("note-card")).toHaveTextContent(
            "65817ae96c73ceb16ba51731",
        );
    });
});
