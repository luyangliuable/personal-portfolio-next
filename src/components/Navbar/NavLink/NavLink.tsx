"use client";

import React, { useMemo } from "react";
import { NavbarItem } from "../Interface/INavbarState";
import { AiOutlineDown } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { cl } from "../../Utility/LogicUtility";
import { usePathname } from "next/navigation";
import EmojIcon from "../../EmojIcon/EmojIcon";
import { isActive } from "../../Utility/StringUtility";
import "./NavLink.css";

interface INavLinkProps {
    link: NavbarItem;
    isSubLink: boolean;
    links?: NavbarItem[];
    hideDropdownMenu: any;
    renderDropdownMenu: any;
}

const NavLink: React.FC<INavLinkProps> = ({
    link,
    isSubLink,
    renderDropdownMenu,
    links,
    hideDropdownMenu,
}) => {
    const navLinkContent = useMemo(
        () =>
            [
                link.name,
                link.sublinks && <AiOutlineDown key="down-icon" />,
            ].filter(Boolean),
        [],
    );

    const targetPath = link.isLocked ? undefined : link.to;
    const pathname = usePathname() ?? "/";

    const onMouseOverAction =
        isSubLink && links
            ? () => {}
            : () =>
                  renderDropdownMenu(
                      links?.find((item) => item.name === link.name)?.sublinks,
                  );

    let href: string | undefined;
    if (link.isLocked) {
        href = undefined;
    } else if (targetPath && !link.isDisabled) {
        href = targetPath;
    } else {
        href = pathname;
    }

    const className = cl(
        "relative flex flex-row justify-center items-center navbar-item",
        {
            "items-start": isSubLink,
            "active-link": isActive(pathname, targetPath),
        },
    );

    const handleClick = () => link.isDisabled && hideDropdownMenu();

    const renderEmoji = () =>
        link.emoji && (
            <EmojIcon
                style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    minHeight: "40px",
                    borderRadius: "4px",
                    marginRight: ".5rem",
                }}
                emojis={[link.emoji]}
            />
        );

    const renderDescription = () =>
        isSubLink && (
            <div
                className="navlink-description w-full"
                style={{ fontSize: ".8rem" }}
            >
                {link.description}
            </div>
        );

    const renderContent = () => (
        <div className="flex flex-row justify-start items-center select-none">
            {renderEmoji()}
            <div className="flex flex-col justify-center select-none">
                <div className="flex flex-row items-center">
                    {...navLinkContent}
                </div>
                {renderDescription()}
            </div>
        </div>
    );

    const renderLockIcon = () =>
        link.isLocked !== undefined && (
            <div
                className={cl(
                    "blur-boundary flex justify-center items-center mx-1",
                )}
                style={{
                    background: "rgba(255,255,255)",
                    minWidth: "30px",
                    minHeight: "30px",
                    height: "30px",
                    borderRadius: "2px",
                    border: ".2px solid #888",
                }}
            >
                <CiLock
                    className="ml-6"
                    style={{ strokeWidth: "1px" }}
                    key="lock-icon"
                />
            </div>
        );

    const Element = link.isLocked ? "div" : "a";

    return (
        <Element
            href={href}
            onClick={handleClick}
            className={className}
            key={link.name}
            onMouseOver={onMouseOverAction}
        >
            {renderContent()}
            {renderLockIcon()}
        </Element>
    );
};

export default NavLink;
