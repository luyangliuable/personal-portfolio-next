import { ReactNode } from "react";

interface ILink {
    name: string;
    icon?: ReactNode;
    to: string;
    isLocked?: boolean;
    onClick?: () => void;
}

interface NavbarItem extends ILink {
    sublinks?: ILink[];
}

interface INavbarState {
    name: string;
    links: NavbarItem[];
    currentlyHoveredNavbarLinkName: string | null;
    lastScrollY: number;
    isNavbarHidden: boolean;
    hideNavBarScrollSensitivity: number;
    navBarDetached: boolean;
    dropdownMenuLinkDisplay: ReactNode[];
}

export { INavbarState, ILink, NavbarItem };
