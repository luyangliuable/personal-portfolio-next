import React from "react";

export interface IButtonPropsWithTo {
    children?: React.ReactNode;
    to: string;
    showButtonLine?: boolean;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    loading?: boolean;
    logoName?: string; // For IconButton
    buttonColor?: string; // For IconButton
    target?: string;
    type?: "button" | "submit" | "reset";
}

export interface IButtonPropsWithOnClick {
    children?: React.ReactNode;
    showButtonLine?: boolean;
    onClick: (e?: any) => void;
    className?: string;
    style?: React.CSSProperties;
    logoName?: string; // For IconButton
    disabled?: boolean;
    loading?: boolean;
    buttonColor?: string; // For IconButton
    target?: string;
    type?: "button" | "submit" | "reset";
}

type IButtonProps = IButtonPropsWithTo | IButtonPropsWithOnClick;

export default IButtonProps;
