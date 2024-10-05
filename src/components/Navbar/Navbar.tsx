import "./Navbar.css";
import linksData from "../../configs/links.json";
import { NavbarItem } from "./Interface/INavbarState";
import NavbarMainSection from "./NavbarMainSection/NavbarMainSection";
import LoginButton from "./LoginButton/LoginButton";

const NavBar = () => {
    const links: NavbarItem[] = linksData.links as NavbarItem[];

    return (
        <article className="navbar flex flex-row">
            <NavbarMainSection links={links} />
            <LoginButton style={{position: "absolute", right: 0}} />
        </article>
    );
}

export default NavBar;
