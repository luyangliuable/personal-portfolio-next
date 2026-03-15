"use client";

import React, { Component } from "react";
import Link from "next/link";
import "./Button.css";
import IButtonProps, {
    IButtonPropsWithTo,
    IButtonPropsWithOnClick,
} from "./Interface/IButtonProps";

import { cardGradientEffect } from "../Utility/MouseUtility";
import { cl } from "../Utility/LogicUtility";

class Button extends Component<IButtonProps, {}> {
    constructor(props: IButtonProps) {
        super(props);
        this.state = {};
    }

    renderButton() {
        const isLoading = this.props.loading;
        const isDisabled = this.props.disabled || isLoading;

        return (
            <span className="flex justify-center items-center">
                <span
                    style={this.props.style}
                    className={cl(
                        "t-button button no-select",
                        this.props.className,
                        isDisabled && "button-disabled",
                    )}
                    onMouseMove={(e) => !isDisabled && cardGradientEffect(e, false, 1, 38, 20)}
                >
                    {isLoading ? "Loading..." : this.props.children}
                </span>
                {this.props.showButtonLine && (
                    <span className="button-line"></span>
                )}
            </span>
        );
    }

    isLinkProps(props: IButtonProps): props is IButtonPropsWithTo {
        return (props as IButtonPropsWithTo).to !== undefined;
    }

    isButtonProps(props: IButtonProps): props is IButtonPropsWithOnClick {
        return (props as IButtonPropsWithOnClick).onClick !== undefined;
    }

    render(): React.ReactNode {
        const isDisabled = this.props.disabled || this.props.loading;

        if (this.isLinkProps(this.props)) {
            return (
                <Link href={isDisabled ? "" : this.props.to}>
                    {this.renderButton()}
                </Link>
            );
        } else if (this.isButtonProps(this.props)) {
            return (
                <button
                    type={this.props.type}
                    className="override-button"
                    disabled={isDisabled}
                    onClick={(e) => {
                        e.preventDefault();
                        if (isDisabled) return;
                        const props = this.props as IButtonPropsWithOnClick;
                        props.onClick(e);
                    }}
                >
                    {this.renderButton()}
                </button>
            );
        }

        return null;
    }
}

export default Button;
