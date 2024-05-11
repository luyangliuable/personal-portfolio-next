import React, { useEffect, useRef, RefObject } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { useScrollPosition } from "../../../hooks";
import "./NavbarScrollProgress.css";

const NavbarScrollProgress: React.FC<{ scrollY: number }> = ({ scrollY }) => {
    const scrollProgress: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updateScrolledProgress(0);
    }, [])

    useEffect(() => {
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        updateScrolledProgress(scrollY! / pageHeight);
    }, [scrollY])


    const updateScrolledProgress = (progress: number) => {
        if (scrollProgress) {
            scrollProgress.current!.style.width = `${progress * 100}vw`;
            const blueEnd = 95 + progress * 4.5;
            scrollProgress.current!.style.background = `linear-gradient(to right,  var(--dark-mode-purple-2), ${blueEnd}%, #00bfff)`;

            if (progress === 1) {
                scrollProgress.current!.classList.add("scroll-progress-complete");
                scrollProgress.current!.style.background = "orange";
            } else {
                scrollProgress.current!.classList.remove("scroll-progress-complete");
            }
        }
    };

    return (
        <aside id="scroll-progress" ref={scrollProgress}>
            <FaArrowCircleUp />
        </aside>
    )
}

export default NavbarScrollProgress;
