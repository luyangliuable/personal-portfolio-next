import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginButton from "@/components/Navbar/LoginButton/LoginButton";
import { auth, signIn, signOut } from "@/auth";

vi.mock("@/auth", () => ({
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
}));
vi.mock("@/components/Image/Image", () => ({
    default: ({ src, className }: any) => <img src={src} className={className} alt="user" />,
}));

describe("LoginButton", () => {
    beforeEach(() => vi.clearAllMocks());

    it("renders signed-in user details and invokes sign-out action.", async () => {
        vi.mocked(auth).mockResolvedValue({ user: { email: "u@test.com", image: "/u.png" } } as any);
        const element: any = await LoginButton({ style: { right: 0 } });
        const fragment: any = React.Children.toArray(element.props.children)[0];
        const form: any = React.Children.toArray(fragment.props.children)[1];
        await form.props.action();
        render(element);
        expect(screen.getByText("u@test.com")).toBeInTheDocument();
        expect(screen.getByAltText("user")).toHaveAttribute("src", "/u.png");
        expect(screen.getByRole("button", { name: "Sign Out" })).toBeInTheDocument();
        expect(signOut).toHaveBeenCalled();
    });

    it("renders sign-in action when no session exists.", async () => {
        vi.mocked(auth).mockResolvedValue(null as any);
        const element: any = await LoginButton({});
        const form: any = React.Children.toArray(element.props.children)[0];
        await form.props.action();
        render(element);
        expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
        expect(signIn).toHaveBeenCalled();
    });
});
