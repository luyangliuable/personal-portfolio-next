"use client";

import React, { useRef, useState } from "react";
import "./LogInPage.css";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from "../../stores/Repository/Auth";
import { AppDispatch, RootState } from '../../stores/store';

const LogInPage: React.FC = () => {
    const userNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const flash = useRef<HTMLInputElement>(null);

    const dispatch: AppDispatch = useDispatch();
    const registerStatus = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);

    const [state, setState] = useState({
        loginStatus: "Pending",
        flashMessage: "",
    });

    const getFlashClassNames = (): string => {
        let className = "login-form--login-flash"; // common class

        switch (state.loginStatus) {
            case "Success":
                className = `flash-green ${className}`;
                break;
            case "Failed":
                className = `flash-red ${className}`;
                break;
        }

        return className;
    }

    const updateLoginFlash = (loginStatus: string, flashMessage: string) => {
        setState({
            loginStatus: loginStatus,
            flashMessage: flashMessage,
        });
    }

    const handleLoginSuccess = (): void => {
        updateLoginFlash("Success", "Login Successful!");
        /* window.location.href = "/"; */
    }

    const handleLoginFailure = (err: any): void => {
        updateLoginFlash("Failed", "Invalid User name or password.");
    }

    const login = (e: any): void => {
        e.preventDefault();
        const loginDetails = {
            username: userNameRef.current!.value,
            password: passwordRef.current!.value
        };
        dispatch(loginUser(loginDetails)).unwrap()
            .then(() => handleLoginSuccess())
            .catch((err) => handleLoginFailure(err));
    }

    return (
        <main>
            <form className="login-form__wrapper position-relative flex flex-col justify-center items-center w-full">
                <h1>Sign in to ~/llcode.tech</h1>
                <div className="login-form">
                    {state.loginStatus !== "Pending" && (
                        <div className={getFlashClassNames()}>
                            {state.flashMessage}
                        </div>
                    )}
                    <input
                        ref={userNameRef}
                        type="text"
                        placeholder="🙋‍♂️🙋‍♀️ username"
                    />
                    <p>Forgot Password?</p>
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="🔒🔑️ password"
                    />
                    <input
                        type="submit"
                        className="button"
                        onClick={(e) => login(e)}
                    />
                </div>
            </form>
        </main >
    );
}

export default LogInPage;
