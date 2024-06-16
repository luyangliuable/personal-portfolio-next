"use client";

import React, { useRef, useState } from 'react';
import "./RegisterPage.css";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../stores/Repository/Auth';
import { AppDispatch, RootState } from '../../stores/store';

export type UserData = {
    email: string,
    password: string,
    username: string,
    first_name: string,
    last_name: string
};

const RegisterPage: React.FC = () => {
    const userNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const firstnameRef = useRef<HTMLInputElement>(null);
    const lastnameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [flashMessage, setFlashMessage] = useState<string>("");

    const dispatch: AppDispatch = useDispatch();
    const registerStatus = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);

    const getFlashClassNames = (): string => {
        let className = "register-form--register-flash"; // common class

        switch (registerStatus) {
            case "succeeded":
                className = `flash-green ${className}`;
                break;
            case "failed":
                className = `flash-red ${className}`;
                break;
        }

        return className;
    }

    const updateRegisterFlash = (registerStatus: string, flashMessage: string) => {
        setFlashMessage(flashMessage);
    }

    const handleRegisterSuccess = (): void => {
        updateRegisterFlash("succeeded", "Register Successful!");
        window.location.href = "/";
    }

    const handleRegisterFailure = (err: string): void => {
        console.log(err);
        updateRegisterFlash("failed", err);
    }

    const register = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const registerDetails = {
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
            username: userNameRef.current!.value,
            first_name: firstnameRef.current!.value,
            last_name: lastnameRef.current!.value,
        };

        dispatch(registerUser(registerDetails)).unwrap()
            .then(() => handleRegisterSuccess())
            .catch((err) => handleRegisterFailure(err));
    }

    return (
        <main>
            <form className="register-form__wrapper position-relative flex flex-col justify-center items-center w-full" onSubmit={register}>
                <h1>Sign up to ~/llcode.tech</h1>
                <div className="register-form">
                    {
                        registerStatus !== "idle" && (
                            <div className={getFlashClassNames()}>{flashMessage}</div>
                        )
                    }
                    <input ref={userNameRef} type="text" placeholder="🙋‍♂️🙋‍♀️ username" />
                    <input ref={emailRef} type="text" placeholder="📧✉️ email" />
                    <input ref={firstnameRef} type="text" placeholder="🌟 firstname" />
                    <input ref={lastnameRef} type="text" placeholder="🌟 lastname" />
                    <input ref={passwordRef} type="password" placeholder="🔒🔑️ password" />
                    <input ref={confirmPasswordRef} type="password" placeholder="🔒🔑️ confirm password" />
                    <input type="submit" className="button" value="Register" />
                </div>
            </form>
        </main>
    )
}

export default RegisterPage;
