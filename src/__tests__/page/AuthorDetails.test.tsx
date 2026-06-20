import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthorDetails from "@/page/BlogPage/BlogContent/AuthorDetails/AuthorDetails";

vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

describe("AuthorDetails", () => {
    it("renders the default author image id", () => {
        render(
            <AuthorDetails
                content={{ author: "Lu", date_created: "2026-06-20" } as any}
            />,
        );
        expect(screen.getByAltText("Lu")).toHaveAttribute(
            "src",
            "65817ae96c73ceb16ba51731",
        );
    });
});
