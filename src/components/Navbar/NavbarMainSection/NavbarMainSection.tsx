"use client";

import React, {
    useMemo,
    useState,
    ReactNode,
    useEffect,
    useRef,
    RefObject,
} from "react";
import Link from "next/link";
import { INavbarState, ILink, NavbarItem } from "../Interface/INavbarState";
import { useScrollPosition } from "../../../hooks";
import INavbarProps from "../Interface/INavbarProps";
import NavBurgerPanel from "../NavBurgerPanel/NavBurgerPanel";
import BurgerMenuIcon from "../BurgerMenuIcon/BurgerMenuIcon";
import NavLink from "../NavLink/NavLink";
import NavbarScrollProgress from "../NavbarScrollProgress/NavbarScrollProgress";
import { toggleProperty, toggleClassName } from "../../Utility/LogicUtility";
import "../Navbar.css";

const NavBarMainSection: React.FC<INavbarProps> = ({ links }) => {
    const { scrollY, deltaScrollCalculation } = useScrollPosition();

    const navbar: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const navbarLeft: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const selectedNavlinkWindow: RefObject<HTMLDivElement> =
        useRef<HTMLDivElement>(null);
    const burgerPanel: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const burgerButton: RefObject<HTMLDivElement> =
        useRef<HTMLDivElement>(null);
    const navbarSubmenu: RefObject<HTMLDivElement> =
        useRef<HTMLDivElement>(null);

    const websiteName = "~/llcode.tech" as const;

    const [navBarHeight, setNavBarHeight] = useState(0);
    const [state, setState] = useState<INavbarState>({
        lastScrollY: 0,
        navBarDetached: false,
        currentlyHoveredNavbarLinkName: null,
        hideNavBarScrollSensitivity: 1,
        isNavbarHidden: false,
        dropdownMenuLinkDisplay: [],
    });

    useEffect(() => {
        const element = navbar.current!;
        const height = element?.getBoundingClientRect().height || 0;
        setNavBarHeight(height);
    }, []);

    const listenDeltaScrolled = () => {
        const { hideNavBarScrollSensitivity, isNavbarHidden } = state;
        const deltaScrolled = deltaScrollCalculation?.deltaScrolled ?? 0;
        if (
            deltaScrolled >= hideNavBarScrollSensitivity &&
            !isNavbarHidden &&
            state.navBarDetached
        ) {
            setNavBarHidden(true);
        } else if (
            deltaScrolled <= -hideNavBarScrollSensitivity &&
            isNavbarHidden
        ) {
            setNavBarHidden(false);
        }
    };

    const listenContinuousScrolled = () => {
        if (!state.navBarDetached && scrollY! >= navBarHeight) {
            setNavBarHidden(true);
            setTimeout(() => setNavbarDetached(true), 100);
        } else if (scrollY! < navBarHeight) {
            setNavbarDetached(false);
        }
    };

    const addBurgerClickOutEventLister = () => {
        window.addEventListener("click", hideBurgerMenu);
    };

    useEffect(() => {
        initializeNavBar();
        setupNavHoverEffect();

        return () => {
            window.removeEventListener("click", hideBurgerMenu);
        };
    }, []);

    const setupNavHoverEffect = () => {
        const navbarLeftTarget = navbarLeft.current!;
        const selectedNavlinkWindowTarget = selectedNavlinkWindow.current!;

        if (navbarLeftTarget && selectedNavlinkWindow) {
            Array.from(navbarLeftTarget.children).forEach((child, index) => {
                if (child !== selectedNavlinkWindowTarget) {
                    child.addEventListener("mouseover", () => {
                        const factor =
                            navbarLeftTarget.children.length - index - 1;
                        const itemWidth = `min(var(--navbar-item-width), var(--navbar-item-max-width))`;
                        const translateXValue = `calc(-${factor} * (${itemWidth} + var(--navbar-item-margin)) + var(--navbar-item-margin))`;
                        selectedNavlinkWindowTarget.style.setProperty(
                            "--dynamic-translate",
                            `${translateXValue}`,
                        );
                    });
                }
            });
        }
    };

    const initializeNavBar = () => {
        listenContinuousScrolled();
        if (window.innerWidth < 900) addBurgerClickOutEventLister();
    };

    useEffect(() => {
        updateScrollingBehavior();
    }, [deltaScrollCalculation?.deltaScrolled]);

    useEffect(() => {
        listenContinuousScrolled();
    }, [scrollY]);

    const updateScrollingBehavior = () => {
        if (deltaScrollCalculation?.deltaScrolled !== 0) listenDeltaScrolled();
    };

    const setNavbarDetached = (set: boolean) => {
        if (
            state.navBarDetached !== set &&
            navbar.current &&
            navbar.current.parentElement
        ) {
            toggleClassName(navbar.current.parentElement, set, "detached");
            toggleClassName(
                navbar.current.parentElement,
                !set,
                "nav-burger-panel-move-lower",
            );
            setState((prev) => {
                return {
                    ...prev,
                    navBarDetached: set,
                };
            });
        }
    };

    const setNavBarHidden = (set: boolean) => {
        if (state.isNavbarHidden === set) return;
        if (navbar.current && navbar.current.parentElement) {
            toggleProperty(
                document.documentElement,
                set,
                { "--navbar-height": "0px" },
                { "--navbar-height": `${navBarHeight}px` },
            );
            toggleClassName(navbar.current.parentElement, set, "hidden");
            setState((prev) => {
                return {
                    ...prev,
                    isNavbarHidden: set,
                };
            });
        }
    };

    const toggleBurgerMenu = () => {
        burgerPanel.current?.classList.toggle("nav-burger-panel-hide");
    };

    const hideBurgerMenu = (e: any) => {
        if (
            burgerPanel.current &&
            !burgerPanel.current.contains(e.target as Node) &&
            !burgerButton.current!.contains(e.target as Node)
        ) {
            burgerPanel.current?.classList.add("nav-burger-panel-hide");
        }
    };

    const setDropdownMenu = (set: boolean): void => {
        if (navbarSubmenu.current && selectedNavlinkWindow.current) {
            toggleClassName(navbarSubmenu.current, set, "show-navbar-dropdown");
            toggleClassName(
                selectedNavlinkWindow.current,
                set,
                "show-navbar-dropdown",
            );
        }
    };

    const renderDropdownMenu = (links?: ILink[]): ReactNode | void => {
        if (links && links.length > 0) {
            setDropdownMenu(true);
            setState((prev) => ({
                ...prev,
                dropdownMenuLinkDisplay: links.map((link) => (
                    <NavLink
                        key={link.name}
                        link={link}
                        isSubLink={true}
                        links={links}
                        renderDropdownMenu={renderDropdownMenu}
                        hideDropdownMenu
                    />
                )),
            }));
        } else {
            setDropdownMenu(false);
        }
    };

    const renderNavLink = (link: NavbarItem, isSubLink: boolean = true) => {
        return (
            <NavLink
                key={link.name}
                link={link}
                isSubLink={isSubLink}
                hideDropdownMenu={() => setDropdownMenu(false)}
                links={links}
                renderDropdownMenu={renderDropdownMenu}
            />
        );
    };

    const navbarBurgerPanel = useMemo(
        () => <NavBurgerPanel links={links} burgerPanel={burgerPanel} />,
        [state.dropdownMenuLinkDisplay],
    );

    return (
        <>
            <div onMouseLeave={() => setDropdownMenu(false)} ref={navbar}>
                <section className="flex items-center">
                    <div className="logo__wrapper">
                        <Link href="/">
                            <h1 className="logo">{websiteName}</h1>
                        </Link>
                    </div>
                    <nav ref={navbarLeft} className="navbar-left flex flex-row">
                        {links.map((item, _) => renderNavLink(item, false))}
                        <section
                            ref={selectedNavlinkWindow}
                            className="selected-navlink-window flex items-center"
                        >
                            <div
                                ref={navbarSubmenu}
                                style={{
                                    width:
                                        state.dropdownMenuLinkDisplay.length > 5
                                            ? "900px"
                                            : "auto",
                                }}
                                className="navbar-item__dropdown blur-boundary box-shadow-spread"
                            >
                                {state.dropdownMenuLinkDisplay}
                            </div>
                        </section>
                    </nav>
                    <div
                        ref={burgerButton}
                        className="nav-burger"
                        onClick={toggleBurgerMenu}
                    >
                        <BurgerMenuIcon />
                    </div>
                </section>
                <NavbarScrollProgress scrollY={scrollY ?? 0} />
            </div>
            {navbarBurgerPanel}
        </>
    );
};

export default NavBarMainSection;
