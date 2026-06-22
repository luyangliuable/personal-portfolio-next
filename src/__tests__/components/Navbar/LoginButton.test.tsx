import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginButton from "@/components/Navbar/LoginButton/LoginButton";

const authState = vi.hoisted(() => ({
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
}));
vi.mock("@/auth", () => ({
    auth: authState.auth,
    signIn: authState.signIn,
    signOut: authState.signOut,
}));
vi.mock("@/components/Image/Image", () => ({ default: ({ src, className }: any) => <img src={src} className={className} alt="User avatar" /> }));

describe("LoginButton", () => {
    beforeEach(() => vi.clearAllMocks());

    it("renders user details and the sign-out action when authentication succeeds.", async () => {
        authState.auth.mockResolvedValue({ user: { email: "me@test.dev", image: "/me.png" } });
        const tree = await LoginButton({ style: { right: 0 } });
        render(tree);
        await tree.props.children[0].props.children[1].props.action();
        expect(screen.getByText("me@test.dev")).toBeInTheDocument();
        expect(screen.getByAltText("User avatar")).toHaveAttribute("src", "/me.png");
        expect(screen.getByRole("button", { name: "Sign Out" })).toBeInTheDocument();
        expect(authState.signOut).toHaveBeenCalledOnce();
    });

    it("renders only the sign-in action when no authenticated session exists.", async () => {
        authState.auth.mockResolvedValue(null);
        const tree = await LoginButton({});
        render(tree);
        await tree.props.children[1].props.action();
        expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
        expect(screen.queryByText("me@test.dev")).not.toBeInTheDocument();
        expect(authState.signIn).toHaveBeenCalledOnce();
    });
});
