"use client";

import React from "react";
import { NavbarItem } from "../Interface/INavbarState";
import { AiOutlineDown } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { cl } from "../../Utility/LogicUtility";

interface INavLinkProps {
    link: NavbarItem,
    isSubLink: boolean,
    links?: NavbarItem[],
    hideDropdownMenu: any,
    renderDropdownMenu: any
}

import { usePathname } from 'next/navigation';
import EmojIcon from "../../EmojIcon/EmojIcon";

const NavLink: React.FC<INavLinkProps> = ({ link, isSubLink, renderDropdownMenu, links, hideDropdownMenu }) => {
    // https://mikebifulco.com/posts/javascript-filter-boolean

    const navLinkContent = [
        link.name,
        link.sublinks && <AiOutlineDown key="down-icon" />,
    ].filter(Boolean);

    const targetPath = link.isLocked ? undefined : link.to;

    const onMouseOverAction = isSubLink && links ? () => {} : () => renderDropdownMenu(links?.filter(item => item.name === link.name)[0].sublinks);

    const pathname = usePathname() ?? "/";

    const isActive = (currentPathname?: string, targetPathname?: string) => {
        if (!currentPathname || !targetPathname) return false;
        if (currentPathname === targetPathname) return true;
        if (targetPathname === "/") return false;
        const currentPath = currentPathname.trim().replace(/\/+$/, "");
        const normalizedTargetPath = targetPathname.trim().replace(/\/+$/, "");
        return currentPath.startsWith(normalizedTargetPath);
    };

    return (
        <a
            href={(targetPath && !link.isDisabled) ? targetPath : pathname}
            onClick={() => link.isDisabled && hideDropdownMenu()}
            className={cl("position-relative flex flex-row justify-center items-center navbar-item", {
                "items-start": isSubLink,
                "active-link": isActive(pathname, targetPath)
            })}
            key={link.name}
            onMouseOver={onMouseOverAction}>
            <div className="flex flex-row justify-start items-center">
                {link.emoji && <EmojIcon style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    minHeight: "40px",
                    borderRadius: "4px",
                    marginRight: ".5rem"
                }} emojis={[link.emoji]} />}
                <div className="flex flex-col justify-center">
                    <div className="flex flex-row items-center">
                        {navLinkContent}
                    </div>
                    {
                        isSubLink && <div
                            className="w-full"
                            style={{
                                fontSize: ".8rem",
                                marginTop: "2px",
                                color: "#888"
                            }}>{link.description}</div>
                    }
                </div>
            </div>
            {
                link.isLocked &&
                <div
                    className="blur-boundary flex justify-center items-center mr-2"
                    style={{
                        background: "rgba(255,255,255,.5)",
                        strokeWidth: "2rem",
                        minWidth: "30px",
                        minHeight: "30px",
                        height: "30px",
                        borderRadius: "4px",
                        border: ".1px solid #888"
                    }}>
                    <CiLock style={{ strokeWidth: "1px" }} key="lock-icon" />
                </div>
            }
        </a>
    );
};

export default NavLink;
