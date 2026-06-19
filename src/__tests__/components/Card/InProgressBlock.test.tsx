import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InProgressBlock from "@/components/Card/InProgressBlock/InProgressBlock";

describe("InProgressBlock", () => {
    it("communicates that a post is still in progress.", () => {
        render(<InProgressBlock />);
        expect(screen.getByText("In Progress")).toBeInTheDocument();
    });
});
