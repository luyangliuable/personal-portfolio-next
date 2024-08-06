import React, { useEffect, useRef, RefObject } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { useScrollPosition } from "../../../hooks";
import { usePathname } from 'next/navigation';
import "./NavbarScrollProgress.css";

const NavbarScrollProgress: React.FC<{ scrollY: number }> = ({}) => {
    const scrollProgress: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const { scrollY } = useScrollPosition();

    const pathname = usePathname();

    useEffect(() => {
        updateScrolledProgress(0);
    }, [pathname]);

    useEffect(() => {
        if (scrollY !== undefined) {
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            updateScrolledProgress(scrollY! / pageHeight);
        }
    }, [scrollY])

    const updateScrolledProgress = (progress: number) => {
        if (scrollProgress?.current) {
            const scrollProgressElement = scrollProgress.current;
            scrollProgressElement.style.width = `${progress * 100}vw`;
            const blueEnd = 95 + progress * 4.5;
            scrollProgressElement.style.background = `linear-gradient(to right, var(--dark-mode-purple-2), ${blueEnd}%, #00bfff)`;
        }
    };

    return (
        <aside id="scroll-progress" ref={scrollProgress}>
            <FaArrowCircleUp />
        </aside>
    )
}

export default NavbarScrollProgress;
