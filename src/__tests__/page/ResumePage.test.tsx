import React from "react";
const h = React.createElement;
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "@/config/api";
import ResumePage from "@/page/ResumePage/ResumePage";

describe("ResumePage", () => {
    it("renders the resume iframe with a resolved image URL from the default API host.", () => {
        render(h(ResumePage));
        expect(screen.getByTitle("Resume")).toHaveAttribute(
            "src",
            `${API_BASE_URL}/image/6599eebc58701a6b8fe5908a?compression=100`,
        );
    });

    it("uses the configured API host when resolving the resume image URL.", async () => {
        const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        try {
            vi.resetModules();
            process.env.NEXT_PUBLIC_API_BASE_URL = "https://assets.test/api/";
            const { default: ConfiguredResumePage } =
                await import("@/page/ResumePage/ResumePage");

            render(h(ConfiguredResumePage));

            expect(screen.getByTitle("Resume")).toHaveAttribute(
                "src",
                "https://assets.test/api/image/6599eebc58701a6b8fe5908a?compression=100",
            );
        } finally {
            if (originalApiBaseUrl === undefined) {
                delete process.env.NEXT_PUBLIC_API_BASE_URL;
            } else {
                process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
            }
            vi.resetModules();
        }
    });
});
