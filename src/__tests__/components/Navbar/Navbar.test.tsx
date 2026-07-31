import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Navbar from "@/components/Navbar/Navbar";

vi.mock("@/components/Navbar/NavbarMainSection/NavbarMainSection", () => ({
    default: ({ links }: any) => <div data-testid="main">{links[0].name}</div>,
}));
vi.mock("@/components/Navbar/LoginButton/LoginButton", () => ({
    default: ({ style }: any) => <div style={style}>Login</div>,
}));

describe("Navbar", () => {
    it("renders configured links through the main section and positions login.", () => {
        render(<Navbar />);
        expect(screen.getByTestId("main")).toHaveTextContent("Home");
        expect(screen.getByText("Login")).toHaveStyle({ position: "absolute", right: "0px" });
    });
});
