import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LogInPage from "@/page/LogInPage/LogInPage";
import RegisterPage from "@/page/RegisterPage/RegisterPage";
import { loginUser, registerUser } from "@/stores/Repository/Auth";

const dispatch = vi.hoisted(() => vi.fn());
const selectorState = vi.hoisted(() => ({ auth: { status: "idle", error: null as string | null } }));

vi.mock("react-redux", () => ({
    useDispatch: () => dispatch,
    useSelector: (selector: any) => selector(selectorState),
}));
vi.mock("@/stores/Repository/Auth", () => ({
    loginUser: vi.fn((payload) => ({ type: "login", payload })),
    registerUser: vi.fn((payload) => ({ type: "register", payload })),
}));

describe("auth pages", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        selectorState.auth = { status: "idle", error: null };
    });

    it("submits login details and shows success or failure flash messages.", async () => {
        dispatch.mockReturnValueOnce({ unwrap: () => Promise.resolve({}) });
        const username = "test-user";
        const password = globalThis.crypto.randomUUID();
        const { container, rerender } = render(<LogInPage />);
        fireEvent.change(screen.getByPlaceholderText("🙋‍♂️🙋‍♀️ username"), {
            target: { value: username },
        });
        fireEvent.change(screen.getByPlaceholderText("🔒🔑️ password"), {
            target: { value: password },
        });
        fireEvent.click(container.querySelector("input[type='submit']")!);
        await waitFor(() => expect(screen.getByText("Login Successful!"))
            .toBeInTheDocument());
        expect(loginUser).toHaveBeenCalledWith(expect.objectContaining({ username }));

        dispatch.mockReturnValueOnce({ unwrap: () => Promise.reject(new Error("bad")) });
        rerender(<LogInPage />);
        fireEvent.click(container.querySelector("input[type='submit']")!);
        await waitFor(() => expect(screen.getByText("Invalid User name or password."))
            .toBeInTheDocument());
    });

    it("submits registration details and displays status styling.", async () => {
        dispatch.mockReturnValue({ unwrap: () => Promise.resolve({}) });
        const password = globalThis.crypto.randomUUID();
        const { rerender } = render(<RegisterPage />);
        fireEvent.change(screen.getByPlaceholderText("🙋‍♂️🙋‍♀️ username"), {
            target: { value: "test-user" },
        });
        fireEvent.change(screen.getByPlaceholderText("📧✉️ email"), {
            target: { value: "u@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("🌟 firstname"), {
            target: { value: "First" },
        });
        fireEvent.change(screen.getByPlaceholderText("🌟 lastname"), {
            target: { value: "Last" },
        });
        fireEvent.change(screen.getByPlaceholderText("🔒🔑️ password"), {
            target: { value: password },
        });
        fireEvent.submit(document.querySelector("form")!);
        await waitFor(() => expect(registerUser).toHaveBeenCalled());

        selectorState.auth = { status: "failed", error: "bad" };
        rerender(<RegisterPage />);
        expect(document.querySelector(".register-form--register-flash"))
            .toHaveClass("flash-red");
    });
});
