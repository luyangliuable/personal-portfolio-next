"use client";

import React, { Component } from "react";
import "./LandingPageCard.css";
import {
    ILandingPageCardProps,
    LandingPageCardType,
} from "./Interface/ILandingPageCardProps";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import { cl } from "../Utility/LogicUtility";

class LandingPageCard extends Component<ILandingPageCardProps, any> {
    constructor(props: ILandingPageCardProps) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        window.addEventListener("scroll", () => {
            this.setState((prevState: any) => ({
                ...prevState,
                scrolling: true,
            }));
        });
        document.documentElement.scrollTo(0, 0);
        setInterval(() => {
            if (this.state.scrolling) {
                this.setState((prevState: any) => ({
                    ...prevState,
                    scrolling: false,
                }));
            }
        }, 500);
    }

    private determineWhatTypeOfLandingPageCardToUse(
        landingPageCardType?: LandingPageCardType,
    ): string {
        const mapper = {
            normal: "landing-page-card",
            fitContent: "landing-page-card landing-page-card--fit-content",
        };

        if (landingPageCardType === undefined) return "landing-page-card";

        return mapper[landingPageCardType];
    }

    render(): any {
        const {
            className,
            blendWithBackground,
            grainyBackground,
            heading: landingPageCardHeading,
        } = this.props;
        return (
            <div
                style={this.props.style}
                className={cl(
                    this.determineWhatTypeOfLandingPageCardToUse(
                        this.props.landingPageCardType,
                    ),
                    className,
                    {
                        "blend-with-background": blendWithBackground,
                        "grainy-background": grainyBackground,
                    },
                )}
            >
                <div className="landing-page-card__content">
                    {landingPageCardHeading && (
                        <header className="landing-page-card__heading important-text">
                            <SequentialRiseSpan
                                elementType="h2"
                                className="landing-page-card__header text-2xl font-bold"
                            >
                                {landingPageCardHeading ?? ""}
                            </SequentialRiseSpan>
                        </header>
                    )}
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default LandingPageCard;
