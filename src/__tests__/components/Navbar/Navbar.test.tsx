import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Navbar from "@/components/Navbar/Navbar";

const captured = vi.hoisted(() => ({ links: [] as any[], loginStyle: undefined as any }));
vi.mock("@/components/Navbar/NavbarMainSection/NavbarMainSection", () => ({
    default: ({ links }: any) => {
        captured.links = links;
        return <nav>Main links: {links.length}</nav>;
    },
}));
vi.mock("@/components/Navbar/LoginButton/LoginButton", () => ({
    default: ({ style }: any) => {
        captured.loginStyle = style;
        return <button>Login</button>;
    },
}));

describe("Navbar", () => {
    it("wires configured navigation links and an absolute login action into the navbar shell.", () => {
        render(<Navbar />);
        expect(screen.getByText(/Main links:/)).toHaveTextContent(String(captured.links.length));
        expect(captured.links.some((link) => link.name === "Home" && link.to === "/")).toBe(true);
        expect(captured.loginStyle).toEqual({ position: "absolute", right: 0 });
    });
});
