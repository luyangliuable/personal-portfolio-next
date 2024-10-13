import { NavbarItem } from "./INavbarState";

interface INavbarProps {
    links: NavbarItem[];
    scrollStatus?: {
        scrolled: number | undefined;
        deltaScrolled: number | undefined;
    };
}

export default INavbarProps;
