"use client";

import {
    useMemo,
    useState,
    type ReactNode,
    useEffect,
    useRef,
    type RefObject,
    useCallback,
} from "react";
import Link from "next/link";
import { INavbarState, ILink, NavbarItem } from "../Interface/INavbarState";
import { useScrollPosition } from "../../../hooks";
import INavbarProps from "../Interface/INavbarProps";
import NavBurgerPanel from "../NavBurgerPanel/NavBurgerPanel";
import BurgerMenuIcon from "../BurgerMenuIcon/BurgerMenuIcon";
import NavLink from "../NavLink/NavLink";
import NavbarScrollProgress from "../NavbarScrollProgress/NavbarScrollProgress";
import {
    toggleProperty,
    toggleClassName,
    deepCompare,
} from "../../Utility/LogicUtility";
import "../Navbar.css";

const websiteName = "~/llcode.tech" as const;

const NavBarMainSection: React.FC<INavbarProps> = ({ links }) => {
    const { scrollY } = useScrollPosition();

    const navbar: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const navbarLeft: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const selectedNavlinkWindow: RefObject<HTMLDivElement> =
        useRef<HTMLDivElement>(null);
    const burgerPanel: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const burgerButton: RefObject<HTMLButtonElement> =
        useRef<HTMLButtonElement>(null);
    const navbarSubmenu: RefObject<HTMLDivElement> =
        useRef<HTMLDivElement>(null);

    const [navBarHeight, setNavBarHeight] = useState(0);
    const [state, setState] = useState<INavbarState>({
        lastScrollY: 0,
        navBarDetached: false,
        currentlyHoveredNavbarLinkName: null,
        isNavbarHidden: false,
        dropdownMenuLinkDisplay: [],
    });

    useEffect(() => {
        const height = navbar.current?.getBoundingClientRect().height ?? 0;
        setNavBarHeight(height);
    }, []);

    const lastScrollTopRef = useRef(0);

    const handleScroll = useCallback(() => {
        const { isNavbarHidden, navBarDetached } = state;
        const st = document.documentElement.scrollTop;
        if (
            st > lastScrollTopRef.current &&
            !isNavbarHidden &&
            navBarDetached
        ) {
            setNavBarHidden(true);
        } else if (st < lastScrollTopRef.current && isNavbarHidden) {
            setNavBarHidden(false);
        }
        lastScrollTopRef.current = Math.max(st, 0);
    }, [state]);

    const listenContinuousScrolled = useCallback(() => {
        if (!state.navBarDetached && scrollY! >= navBarHeight) {
            setNavBarHidden(true);
            setTimeout(() => setNavbarDetached(true), 100);
        } else if (scrollY! < navBarHeight) {
            setNavbarDetached(false);
        }
    }, [state.navBarDetached, scrollY, navBarHeight]);

    const addBurgerClickOutEventLister = useCallback(() => {
        globalThis.addEventListener("click", hideBurgerMenu);
    }, []);

    const setupNavHoverEffect = useCallback(() => {
        const navbarLeftTarget = navbarLeft.current;
        const selectedNavlinkWindowTarget = selectedNavlinkWindow.current;
        if (navbarLeftTarget && selectedNavlinkWindowTarget) {
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
    }, [navbarLeft, selectedNavlinkWindow]);

    const initializeNavBar = useCallback(() => {
        listenContinuousScrolled();
        if (globalThis.innerWidth < 900) addBurgerClickOutEventLister();
    }, [listenContinuousScrolled, addBurgerClickOutEventLister]);

    useEffect(() => {
        initializeNavBar();
        setupNavHoverEffect();
        return () => {
            globalThis.removeEventListener("click", hideBurgerMenu);
        };
    }, [initializeNavBar, setupNavHoverEffect]);

    useEffect(() => {
        listenContinuousScrolled();
        handleScroll();
    }, [scrollY, handleScroll, listenContinuousScrolled]);

    const setNavbarDetached = useCallback(
        (set: boolean) => {
            if (
                state.navBarDetached !== set &&
                navbar.current?.parentElement
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
        },
        [state.navBarDetached],
    );

    const setNavBarHidden = useCallback(
        (set: boolean) => {
            if (state.isNavbarHidden === set) return;
            if (navbar.current?.parentElement) {
                toggleProperty(
                    document.documentElement,
                    set,
                    { "--navbar-height": "0px" },
                    { "--navbar-height": `${navBarHeight}px` },
                );
                toggleClassName(
                    navbar.current.parentElement,
                    set,
                    "navbar--hidden",
                );
                setState((prev) => {
                    return {
                        ...prev,
                        isNavbarHidden: set,
                    };
                });
            }
        },
        [state.isNavbarHidden, navBarHeight],
    );

    const toggleBurgerMenu = useCallback(() => {
        burgerPanel.current?.classList.toggle("nav-burger-panel-hide");
    }, []);

    const hideBurgerMenu = useCallback((e: any) => {
        const button = burgerButton.current;
        const panel = burgerPanel.current;
        if (
            panel &&
            !panel.contains(e.target as Node) &&
            button &&
            !button.contains(e.target as Node)
        ) {
            panel.classList.add("nav-burger-panel-hide");
        }
    }, []);

    const setDropdownMenu = useCallback((set: boolean): void => {
        if (!set) {
            setState((prev) => ({
                ...prev,
                dropdownMenuLinkDisplay: [],
            }));
        }
        if (navbarSubmenu.current && selectedNavlinkWindow.current) {
            toggleClassName(navbarSubmenu.current, set, "show-navbar-dropdown");
            toggleClassName(
                selectedNavlinkWindow.current,
                set,
                "show-navbar-dropdown",
            );
        }
    }, []);

    const renderDropdownMenu = useCallback(
        (links?: ILink[]): ReactNode | void => {
            if (!links) {
                setDropdownMenu(false);
                return;
            }
            if (!deepCompare(links, state.dropdownMenuLinkDisplay)) {
                setDropdownMenu(true);
                setState((prev) => ({
                    ...prev,
                    dropdownMenuLinkDisplay: links,
                }));
            }
        },
        [state.dropdownMenuLinkDisplay, setDropdownMenu],
    );

    const hideDropdownMenu = useCallback(() => setDropdownMenu(false), []);

    const renderNavLink = useCallback(
        (link: NavbarItem, isSubLink: boolean = true) => {
            return (
                <NavLink
                    key={link.name}
                    link={link}
                    isSubLink={isSubLink}
                    hideDropdownMenu={hideDropdownMenu}
                    links={links}
                    renderDropdownMenu={renderDropdownMenu}
                />
            );
        },
        [hideDropdownMenu, links, renderDropdownMenu],
    );

    const navbarBurgerPanel = useMemo(
        () => <NavBurgerPanel links={links} burgerPanel={burgerPanel} />,
        [links, state.dropdownMenuLinkDisplay, burgerPanel],
    );

    const memoizedBurgerMenuIcon = useMemo(() => <BurgerMenuIcon />, []);

    return (
        <>
            <div onMouseLeave={() => setDropdownMenu(false)} ref={navbar} role="navigation" aria-label="Main navigation">
                <section className="flex items-center h-full">
                    <div className="logo__wrapper">
                        <Link href="/">
                            <h1 className="logo">{websiteName}</h1>
                        </Link>
                    </div>
                    <div className="h-[20px] w-[2px] bg-[#CCC] mr-4"></div>
                    <nav ref={navbarLeft} className="navbar-left flex flex-row">
                        {links.map((item) => renderNavLink(item, false))}
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
                                {state.dropdownMenuLinkDisplay.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        link={link}
                                        isSubLink={true}
                                        links={links}
                                        renderDropdownMenu={renderDropdownMenu}
                                        hideDropdownMenu={hideDropdownMenu}
                                    />
                                ))}
                            </div>
                        </section>
                    </nav>
                    <button
                        type="button"
                        ref={burgerButton}
                        className="nav-burger"
                        onClick={toggleBurgerMenu}
                        aria-label="Toggle navigation menu"
                    >
                        {memoizedBurgerMenuIcon}
                    </button>
                </section>
                <NavbarScrollProgress scrollY={scrollY ?? 0} />
            </div>
            {navbarBurgerPanel}
        </>
    );
};

export default NavBarMainSection;
