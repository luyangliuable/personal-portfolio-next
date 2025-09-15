import React, { CSSProperties } from "react";
import { auth } from "../../../auth";
import "./LoginButton.css";
import Link from "next/link";

const LoginButton: React.FC<{ style?: CSSProperties }> = async ({ style }) => {
  const data = await auth();

  return (
    <nav
      style={style}
      className="flex flex-row items-center text-sm bg-[red]"
    >
      {/* {data && (
        <>
          <div className="user-details flex flex-row flex items-center gap-half"></div>
            <button className="navbar-item login-button flex justify-center">
              Sign Out
            </button>
        </>
      )} */}
      <Link
        href="/user/login"
        className="navbar-item login-button flex justify-center"
      >
        Sign In
      </Link>
    </nav>
  );
};

export default LoginButton;
