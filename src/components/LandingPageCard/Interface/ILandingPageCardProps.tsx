import { CSSProperties, ReactNode } from "react";

export type LandingPageCardType = "normal" | "fitUnderNavbar" | "fitContent";

export interface ILandingPageCardProps {
    className?: string,
    heading?: string,
    style?: CSSProperties;
    children?: ReactNode,
    landingPageCardType?: LandingPageCardType,
    blendWithBackground?: boolean
}
