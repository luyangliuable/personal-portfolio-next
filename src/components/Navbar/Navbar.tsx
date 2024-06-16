'use client';

import React, { useMemo, useState, ReactNode, useEffect, useRef, RefObject } from "react";
import Link from "next/link";
import { INavbarState, ILink, NavbarItem } from "./Interface/INavbarState";
import { useScrollPosition } from "../../hooks";
import { FaArrowCircleUp } from "react-icons/fa";
import INavbarProps from "./Interface/INavbarProps";
import NavBurgerPanel from "./NavBurgerPanel/NavBurgerPanel";
import BurgerMenuIcon from "./BurgerMenuIcon/BurgerMenuIcon";
import LoginButton from "./LoginButton/LoginButton";
import linksData from "../../configs/links.json";
import NavLink from "./NavLink/NavLink";
import NavbarScrollProgress from "./NavbarScrollProgress/NavbarScrollProgress";
import "./Navbar.css";

import { usePathname } from 'next/navigation';

const NavBar: React.FC<INavbarProps> = () => {
    const { scrollY, deltaScrollCalculation } = useScrollPosition();

    const navbar: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const navbarLeft: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const selectedNavlinkWindow: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const burgerPanel: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const burgerButton: RefObject<HTMLDivElement>  = useRef<HTMLDivElement>(null);
    const scrollProgress: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const navbarSubmenu: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const [navBarHeight, setNavBarHeight] = useState(0);

    const pathname = usePathname();

    const links = useMemo(() => {
        return linksData.links as NavbarItem[]
    }, [])

    const websiteName = "~/llcode.tech" as const;

    const [state, setState] = useState<INavbarState>({
        lastScrollY: 0,
        navBarDetached: false,
        currentlyHoveredNavbarLinkName: null,
        hideNavBarScrollSensitivity: 1,
        isNavbarHidden: false,
        dropdownMenuLinkDisplay: []
    });

    useEffect(() => {
        const element = navbar.current!;
        const height = element?.getBoundingClientRect().height || 0;
        setNavBarHeight(height);
    }, [])

    const listenDeltaScrolled = () => {
        const { hideNavBarScrollSensitivity, isNavbarHidden } = state;
        const deltaScrolled = deltaScrollCalculation?.deltaScrolled ?? 0;
        if ((deltaScrolled >= hideNavBarScrollSensitivity) && !isNavbarHidden && state.navBarDetached) {
            hideNavBar();
        } else if (deltaScrolled <= -hideNavBarScrollSensitivity && isNavbarHidden) {
            showNavBar();
        }
    };

    const listenContinuousScrolled = () => {
        if (!state.navBarDetached && scrollY! >= navBarHeight) {
            detachNavBar();
        } else if (scrollY! < navBarHeight) {
            attachNavBar();
        }
    };

    const addBurgerClickOutEventLister = () => {
        window.addEventListener("click", hideBurgerMenu);
    }

    useEffect(() => {
        initializeNavBar();
        setupNavHoverEffect();

        return () => {
            window.removeEventListener("click", hideBurgerMenu);
        };
    }, [])

    const setupNavHoverEffect = () => {
        const navbarLeftTarget = navbarLeft.current!;
        const selectedNavlinkWindowTarget = selectedNavlinkWindow.current!;

        if (navbarLeftTarget && selectedNavlinkWindow) {
            Array.from(navbarLeftTarget.children).forEach((child, index) => {
                if (child !== selectedNavlinkWindowTarget) {
                    child.addEventListener("mouseover", () => {
                        const factor = navbarLeftTarget.children.length - index - 1;
                        const translateXValue = `calc(-${factor}*( min(var(--navbar-item-width), var(--navbar-item-max-width)) + var(--navbar-item-margin)) + var(--navbar-item-margin) )`;
                        selectedNavlinkWindowTarget.style.setProperty("--dynamic-translate", `${translateXValue}`);
                    });
                }
            });
        }
    }

    const initializeNavBar = () => {
        listenContinuousScrolled();
        // updateScrolledProgress(0);
        if (window.innerWidth < 900) addBurgerClickOutEventLister();
    }

    useEffect(() => {
        updateScrollingBehavior();
    }, [deltaScrollCalculation?.deltaScrolled]);

    useEffect(() => {
        listenContinuousScrolled()
    }, [scrollY])

    const updateScrollingBehavior = () => {
        if (deltaScrollCalculation?.deltaScrolled !== 0) listenDeltaScrolled();
    }

    const attachNavBar = () => {
        navbar.current?.classList.remove("detached");
        burgerPanel.current?.classList.add("nav-burger-panel-move-lower");
        setState(prev => {
            return {
                ...prev,
                navBarDetached: false
            };
        });
    }

    const detachNavBar = () => {
        navbar.current?.classList.add("detached");
        burgerPanel.current?.classList.remove("nav-burger-panel-move-lower");
        setState(prev => {
            return {
                ...prev,
                navBarDetached: true
            }
        });
    };


    const hideNavBar = () => {
        // If the navbar is not already hidden, hide it and set the navbar height to 0px
        navbar.current?.classList.add("hidden");
        document.documentElement.style.setProperty('--navbar-height', '0px');
        setState(prev => {
            return {
                ...prev,
                isNavbarHidden: true
            }
        });
    };

    const showNavBar = () => {
        navbar.current?.classList.remove("hidden");
        // Connascence of value here /Users/blackfish/personal-portfolio/client/src/App.css:5
        document.documentElement.style.setProperty('--navbar-height', `${navBarHeight}px`);
        setState(prev => {
            return {
                ...prev,
                isNavbarHidden: false
            }
        });
    };

    const toggleBurgerMenu = () => {
        burgerPanel.current?.classList.toggle("nav-burger-panel-hide");
    };

    const hideBurgerMenu = (e: any) => {
        if (burgerPanel.current
            && !burgerPanel.current.contains(e.target as Node)
            && !burgerButton.current!.contains(e.target as Node)) {
            burgerPanel.current?.classList.add("nav-burger-panel-hide");
        }
    };

    const hideDropdownMenu = () => {
        navbarSubmenu.current?.classList.remove("show-navbar-dropdown");
        selectedNavlinkWindow.current?.classList.remove("show-navbar-dropdown");
    }

    const showDropdownMenu = () => {
        navbarSubmenu.current?.classList.add("show-navbar-dropdown");
        selectedNavlinkWindow.current?.classList.add("show-navbar-dropdown");
    }

    const renderDropdownMenu = (links?: ILink[]): ReactNode | void => {
        console.log(links);
        if (links && links.length > 0) {
            showDropdownMenu();

            setState(prev => ({
                ...prev,
                dropdownMenuLinkDisplay: links.map(link => (
                    <NavLink
                        key={link.name}
                        link={link}
                        isSubLink={true}
                        links={links}
                        renderDropdownMenu={renderDropdownMenu}
                        hideDropdownMenu />
                )),
            }));
        } else {
            hideDropdownMenu();
        }
    };

    const renderNavLink = (link: NavbarItem, isSubLink: boolean = true) => {
        return (
            <NavLink
                key={link.name}
                link={link}
                isSubLink={isSubLink}
                hideDropdownMenu={hideDropdownMenu}
                links={links}
                renderDropdownMenu={renderDropdownMenu} />
        );
    };

    const navBarMainSection = useMemo(() => (
        <section className="navbar-content flex items-center">
            <div className="logo__wrapper">
                <Link href="/"><h1 className="logo">{websiteName}</h1></Link>
            </div>
            <nav ref={navbarLeft} className="navbar-left flex flex-row">
                {links.map((item, _) => renderNavLink(item, false))}
                <LoginButton onMouseOver={renderDropdownMenu} />
                <section ref={selectedNavlinkWindow} className="selected-navlink-window flex items-center">
                    <div ref={navbarSubmenu} className="navbar-item__dropdown ">
                        {state.dropdownMenuLinkDisplay}
                    </div>
                </section>
            </nav>
            <div ref={burgerButton} className="nav-burger" onClick={toggleBurgerMenu}><BurgerMenuIcon /></div>
        </section>
    ), [state.dropdownMenuLinkDisplay]);

    const navbarBurgerPanel = useMemo(() => (
        <NavBurgerPanel links={links} burgerPanel={burgerPanel} />
    ), [state.dropdownMenuLinkDisplay]);

    return (
        <>
            <article className="navbar" onMouseLeave={() => hideDropdownMenu()} ref={navbar}>
                {navBarMainSection}
                <NavbarScrollProgress scrollY={ scrollY ?? 0 }/>
            </article>
            {navbarBurgerPanel}
        </>
    );
}

export default NavBar;
