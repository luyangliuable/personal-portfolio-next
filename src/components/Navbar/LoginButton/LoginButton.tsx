import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { CiLogin } from 'react-icons/ci';
import { AiFillCaretDown } from 'react-icons/ai';
import { truncateTextBody } from "../../Utility/StringUtility";
import ILoginButtonProps from "./Interface/ILoginButtonProps";
import { auth, signIn, signOut } from "../../../auth";
import "./LoginButton.css";
import Image from "../../Image/Image";

const LoginButton: React.FC<{ style?: CSSProperties }> = async ({ style }) => {
    const data = await auth();

    return (
        <nav style={style} className="login-button--container flex flex-row items-center">
            {
                data &&
                <>
                    <div className="user-details flex flex-row flex items-center gap-half">
                        {data.user!.email}
                        <Image className="user-image-md" src={data.user!.image as string} />
                    </div>
                    <form
                        action={async () => {
                            "use server"
                            await signOut()
                        }}
                        className="w-full flex flex-row gap-1">
                        <button className="navbar-item login-button flex justify-center">
                            Sign Out
                        </button>
                    </form>
                </>
            }
            {
                !data &&
                <form
                    action={async () => {
                        "use server"
                        await signIn()
                    }}
                    className="w-full">
                    <button className="navbar-item login-button flex justify-center">
                        Sign In
                    </button>
                </form>

            }
        </nav >
    );
};

export default LoginButton;
