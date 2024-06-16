"use client";

import React from 'react';
import Link from "next/link";
import IButtonProps, { IButtonPropsWithTo, IButtonPropsWithOnClick } from "../../Button/Interface/IButtonProps";
import './InlineLink.css';

const InlineLink: React.FC<IButtonProps> = (props) => {
    const renderButton = () => (
        <span style={props.style} className="inline-link__text no-select flex items-center box-border">
            {props.children}
        </span>
    );

    const isLinkProps = (props: IButtonProps): props is IButtonPropsWithTo => {
        return (props as IButtonPropsWithTo).to !== undefined;
    };

    const isButtonProps = (props: IButtonProps): props is IButtonPropsWithOnClick => {
        return (props as IButtonPropsWithOnClick).onClick !== undefined;
    };

    if (isLinkProps(props)) {
        return (
            <Link target={props.target} href={props.to ?? ""} className={props.className}>
                {renderButton()}
            </Link>
        );
    } else if (isButtonProps(props)) {
        return (
            <div onClick={props.onClick} className={props.className}>
                {renderButton()}
            </div>
        );
    }

    return null;
};

export default InlineLink;
