import React, { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavBurgerPanel from "@/components/Navbar/NavBurgerPanel/NavBurgerPanel";

vi.mock("next/navigation", () => ({ usePathname: () => "/parent" }));
vi.mock("@/components/Accordion/Accordion", () => {
    const Accordion = ({ children }: any) => <div>{children}</div>;
    Accordion.Item = ({ heading, children }: any) => <section><h2>{heading}</h2>{children}</section>;
    Accordion.Button = ({ heading, href, disabled }: any) => <a href={href} aria-disabled={disabled}>{heading}</a>;
    return { default: Accordion };
});

describe("NavBurgerPanel", () => {
    it("portals nested and locked mobile navigation entries after the client mount completes.", async () => {
        render(<NavBurgerPanel burgerPanel={createRef<HTMLDivElement>()} links={[{
            name: "Parent",
            to: "/parent",
            sublinks: [{ name: "Secret", emoji: "🔒", to: "/secret", isLocked: true }],
        } as any, { name: "Plain", to: "/plain" }]} />);
        await waitFor(() => expect(screen.getByText("Parent")).toBeInTheDocument());
        expect(screen.getByText("🔒 Secret")).toHaveAttribute("aria-disabled", "true");
        expect(screen.getByText("Plain")).toHaveAttribute("href", "/plain");
    });
});
