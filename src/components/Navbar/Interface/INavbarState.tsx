import { ReactNode } from "react";

export interface ILink {
    name: string;
    icon?: ReactNode;
    to: string;
    isLocked?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
}

export interface NavbarItem extends ILink {
    sublinks?: ILink[];
}

export interface INavbarState {
    currentlyHoveredNavbarLinkName: string | null;
    lastScrollY: number;
    isNavbarHidden: boolean;
    hideNavBarScrollSensitivity: number;
    navBarDetached: boolean;
    dropdownMenuLinkDisplay: ReactNode[];
}
