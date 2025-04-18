import { CSSProperties, ReactNode } from "react";

export type LandingPageCardType = "normal" | "fitContent";

export interface ILandingPageCardProps {
  className?: string;
  heading?: string;
  style?: CSSProperties;
  children?: ReactNode;
  landingPageCardType?: LandingPageCardType;
  grainyBackground?: boolean;
  blendWithBackground?: boolean;
}
