import React, { useEffect, ReactNode } from "react";
import Link from "next/link";
import { CiLogin } from 'react-icons/ci';
import { AiFillCaretDown } from 'react-icons/ai';
import UserRepository from "../../../repositories/UserRepository";
import { truncateTextBody } from "../../Utility/StringUtility";
import { useDispatch, useSelector } from 'react-redux';
import ILoginButtonProps from "./Interface/ILoginButtonProps";
import { selectIsLoggedIn, selectCurrentUser } from "../../../stores/Selectors/Auth";
import { authUser } from "../../../stores/Repository/Auth";
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from "../../../stores/store";

const LoginButton: React.FC<ILoginButtonProps> = ({ onMouseOver }) => {
    const dispatch: AppDispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userName = useSelector(selectCurrentUser);

    useEffect(() => {
        dispatch(authUser())
            .then(unwrapResult)
            .then(data => {})
            .catch((err) => {});
    }, [dispatch]);

    const logoff = () => {
        UserRepository.logout().then(() => {
            window.location.href = "/";
        });
    };

    const loginButtonContent = {
        loggedIn: {
            name: "Hello",
            to: "/user/login",
            icon: (<AiFillCaretDown />),
            sublinks: [{
                name: "Logout",
                to: "",
                onClick: () => logoff()
            }]
        },
        loggedOff: {
            name: "Login",
            icon: (<CiLogin />),
            to: "/user/login",
            sublinks: [{
                name: "Sign Up",
                to: "/user/register"
            }]
        },
    };

    const getLoginButtonInnerHTML = (): ReactNode => {
        if (isLoggedIn && userName) {
            return <>Hi {truncateTextBody(userName, 5)}</>;
        }
        return (
            <>{loginButtonContent.loggedOff.name} {loginButtonContent.loggedOff.icon}</>
        );
    };

    const getLoginButtonTo = (): string => {
        return loginButtonContent.loggedIn.to;
    };

    const sublinks = isLoggedIn ? loginButtonContent.loggedIn.sublinks : loginButtonContent.loggedOff.sublinks;

    return (
        <Link
            href={getLoginButtonTo()}
            onMouseOver={() => onMouseOver(sublinks)}
            className="navbar-item flex justify-center">
            {getLoginButtonInnerHTML()}
            <div className="navbar-item__dropdown"></div>
        </Link>
    );
};

export default LoginButton;
