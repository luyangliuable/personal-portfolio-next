import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavBurgerPanel from "@/components/Navbar/NavBurgerPanel/NavBurgerPanel";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/api" }));
vi.mock("@/components/Accordion/Accordion", () => {
    function Accordion({ children, className }: any) {
        return <div className={className}>{children}</div>;
    }
    function AccordionItem({ heading, children, className }: any) {
        return <section className={className}><h3>{heading}</h3>{children}</section>;
    }
    function AccordionButton({ heading, href, disabled, className }: any) {
        return <a className={className} href={href} aria-disabled={disabled}>{heading}</a>;
    }
    (Accordion as any).Item = AccordionItem;
    (Accordion as any).Button = AccordionButton;
    return { default: Accordion };
});

describe("NavBurgerPanel", () => {
    it("portals accordion links and marks active entries.", async () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <NavBurgerPanel
                burgerPanel={ref}
                links={[
                    { name: "Docs", to: "/docs", sublinks: [
                        { name: "API", emoji: "A", to: "/docs/api" },
                    ] },
                    { name: "Home", to: "/" },
                    { name: "Locked", to: "/locked", isLocked: true },
                ] as any}
            />,
        );
        await waitFor(() => expect(ref.current).toBeInTheDocument());
        expect(screen.getByText("Docs").parentElement)
            .toHaveClass("!bg-[var(--dark-mode-purple-2)]");
        expect(screen.getByText("A API")).toHaveAttribute("href", "/docs/api");
        expect(screen.getByText("Locked")).toHaveAttribute("aria-disabled", "true");
    });
});
