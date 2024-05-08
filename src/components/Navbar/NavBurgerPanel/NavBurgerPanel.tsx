import React from 'react';
import Link from "next/link";
import INavBurgerPanelProps from "./Interface/INavBurgerPanelProps";
import "./NavBurgerPanel.css";

import { usePathname } from 'next/navigation';

const NavBurgerPanel: React.FC<INavBurgerPanelProps> = ({ burgerPanel, links }) => {
    const pathname = usePathname();

    return (
        <div ref={burgerPanel} className="nav-burger-panel nav-burger-panel-hide nav-burger-panel-move-lower">
            {
                links.map(link => {
                    const isActive = pathname === link.to;
                    return (
                        <Link
                            href={link.to ?? ""}
                            className={`burger-item flex justify-center items-center ${isActive ? "active-link" : ""}`}
                            key={link.name}
                        >
                            {link.name}
                        </Link>
                    )
                })
            }
        </div>
    )
};


export default React.memo(NavBurgerPanel);
