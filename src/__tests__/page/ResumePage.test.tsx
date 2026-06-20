import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { API_BASE_URL } from "@/config/api";
import ResumePage from "@/page/ResumePage/ResumePage";

describe("ResumePage", () => {
    it("renders the resume iframe with a resolved image URL", () => {
        render(<ResumePage />);
        expect(screen.getByTitle("Resume")).toHaveAttribute(
            "src",
            `${API_BASE_URL}/image/6599eebc58701a6b8fe5908a?compression=100`,
        );
    });
});
