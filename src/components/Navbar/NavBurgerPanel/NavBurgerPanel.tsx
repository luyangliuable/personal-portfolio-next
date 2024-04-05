import React from 'react';
import Link from "next/link";
import INavBurgerPanelProps from "./Interface/INavBurgerPanelProps";
import "./NavBurgerPanel.css";

const NavBurgerPanel: React.FC<INavBurgerPanelProps> = ({ burgerPanel, links }) => {
    return (
        <div ref={burgerPanel} className="nav-burger-panel nav-burger-panel-hide nav-burger-panel-move-lower">
            {
                links.map(link => (
                    <Link
                        href={link.to ?? "/"}
                        className={({ isActive }) => ["burger-item", isActive ? "burger-item active-link" : null].filter(Boolean).join(" ")}
                        key={link.name}
                    >
                        {link.name}
                    </Link>
                ))
            }
        </div>
    )
};


export default NavBurgerPanel;
