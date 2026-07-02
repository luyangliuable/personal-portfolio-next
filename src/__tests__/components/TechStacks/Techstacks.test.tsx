import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TechStack from "@/components/TechStacks/Techstacks";

vi.mock("react-icons/fa", () => ({
    FaReact: (props: any) => <svg data-testid="react-icon" {...props} />,
    FaCss3Alt: (props: any) => <svg data-testid="css-icon" {...props} />,
    FaHtml5: (props: any) => <svg data-testid="html-icon" {...props} />,
}));
vi.mock("react-icons/si", () => ({
    SiTailwindcss: (props: any) => (
        <svg data-testid="tailwind-icon" {...props} />
    ),
}));

describe("TechStack", () => {
    it("renders orbit labels, paths, and frontend technology icons.", () => {
        const { container } = render(<TechStack />);
        expect(screen.getByText("Frontend Tech Stacks")).toBeInTheDocument();
        expect(screen.getByText("Backend Tech Stacks")).toBeInTheDocument();
        expect(container.querySelectorAll("circle")).toHaveLength(2);
        expect(container.querySelector("#pathOuter")).toBeInTheDocument();
        expect(screen.getByTestId("react-icon")).toBeInTheDocument();
        expect(screen.getByTestId("tailwind-icon")).toBeInTheDocument();
    });
});
