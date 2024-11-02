import { ReactNode } from "react";

export interface ILink {
    name: string;
    icon?: ReactNode;
    emoji?: string;
    to: string;
    isLocked?: boolean;
    description?: string;
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
    navBarDetached: boolean;
    dropdownMenuLinkDisplay: ILink[];
}
