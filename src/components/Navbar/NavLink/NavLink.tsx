"use client";

import React from "react";
import { NavbarItem } from "../Interface/INavbarState";
import Link from "next/link";
import { AiOutlineDown } from "react-icons/ai";
import { CiLock } from "react-icons/ci";

interface INavLinkProps {
link: NavbarItem,
isSubLink: boolean,
links?: NavbarItem[],
hideDropdownMenu: any,
renderDropdownMenu: any
}

import { usePathname } from 'next/navigation';

const NavLink: React.FC<INavLinkProps> = ({ link, isSubLink, renderDropdownMenu, links, hideDropdownMenu }) => {
  // https://mikebifulco.com/posts/javascript-filter-boolean

  const navLinkContent = [
  link.name, link.icon,
  link.sublinks && <AiOutlineDown key="down-icon" />,
  link.isLocked && <CiLock key="lock-icon" />
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
    className={`navbar-item flex justify-center items-center  ${isActive(pathname, targetPath) ? "active-link" : ""}`}
    key={link.name}
    onMouseOver={onMouseOverAction}>
    {navLinkContent}
  </a>
  );
  };

  export default NavLink;
