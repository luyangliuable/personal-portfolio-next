"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import INavBurgerPanelProps from "./Interface/INavBurgerPanelProps";
import { usePathname } from "next/navigation";
import Accordion from "../../Accordion/Accordion";
import { ILink, NavbarItem } from "../Interface/INavbarState";

import "./NavBurgerPanel.css";
import { cl } from "../../Utility/LogicUtility";
import { isActive } from "../../Utility/StringUtility";

const NavBurgerPanel: React.FC<INavBurgerPanelProps> = ({
    burgerPanel,
    links,
}) => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            {isMounted &&
                createPortal(
                    <div
                        key="navbar-burger-panel"
                        ref={burgerPanel}
                        className="nav-burger-panel-hide nav-burger-panel nav-burger-panel-move-lower"
                    >
                        <Accordion className="mb-20">
                            {links.map((link: NavbarItem) => {
                                return link.sublinks ? (
                                    <Accordion.Item
                                        heading={link.name}
                                        className={cl({
                                            "!bg-[var(--dark-mode-purple-2)] color-white":
                                                isActive(pathname, link.to),
                                        })}
                                        key={link.name}
                                    >
                                        {link.sublinks?.map((sublink) => {
                                            return (
                                                <Accordion.Button
                                                    className={cl({
                                                        "!bg-[var(--dark-mode-purple-2)] color-white":
                                                            isActive(
                                                                sublink.to,
                                                                pathname,
                                                            ),
                                                    })}
                                                    href={sublink.to ?? ""}
                                                    disabled={sublink.isLocked}
                                                    heading={`${sublink.emoji} ${sublink.name}`}
                                                    key={sublink.name}
                                                ></Accordion.Button>
                                            );
                                        })}
                                    </Accordion.Item>
                                ) : (
                                    <Accordion.Button
                                        key={link.name}
                                        href={link.to ?? ""}
                                        className={cl({
                                            "!bg-[var(--dark-mode-purple-2)] color-white":
                                                link.to == pathname,
                                        })}
                                        heading={link.name}
                                        disabled={link.isLocked}
                                    ></Accordion.Button>
                                );
                            })}
                        </Accordion>
                    </div>,
                    document.body,
                )}
        </>
    );
};

export default React.memo(NavBurgerPanel);
