"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from "next/link";
import INavBurgerPanelProps from "./Interface/INavBurgerPanelProps";
import "./NavBurgerPanel.css";
import { usePathname } from 'next/navigation';

const NavBurgerPanel: React.FC<INavBurgerPanelProps> = ({ burgerPanel, links }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted &&
        createPortal(
          (
            <div ref={burgerPanel} className="nav-burger-panel nav-burger-panel-hide nav-burger-panel-move-lower">
              {links.map(link => {
                const isActive = pathname === link.to;
                return (
                  <Link
                    href={link.to ?? ""}
                    className={`burger-item flex justify-center items-center ${isActive ? "active-link" : ""}`}
                    key={link.name}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          ),
          document.body
        )}
    </>
  );
};

export default React.memo(NavBurgerPanel);
