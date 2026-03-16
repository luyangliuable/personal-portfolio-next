import React, { useEffect, useRef, useMemo } from "react";
import "./ZaBanquet.css";

const colorThemes: Record<string, string>[] = [
    {
        "--color-1": "#ffebcc",
        "--color-2": "orange",
        "--color-3": "#ff9966",
        "--color-4": "#ff6633",
    },
    {
        "--color-1": "#ffccf2",
        "--color-2": "#ff99e6",
        "--color-3": "#ff66d9",
        "--color-4": "#ff33cc",
    },
    {
        "--color-1": "#ffcccc",
        "--color-2": "#ff9999",
        "--color-3": "#ff6666",
        "--color-4": "#ff3333",
    },
    {
        "--color-1": "#ffffff",
        "--color-2": "white",
        "--color-3": "orange",
        "--color-4": "#d9d9d9",
    },
];

const ZaBanquet = () => {
    const flowersContainerRef = useRef<HTMLDivElement>(null);
    const flowersRef = useRef<React.RefObject<HTMLDivElement>[]>([]);

    const flowers = useMemo(() => {
        const isMobile =
            typeof window !== "undefined" && window.innerWidth < 768;
        const num = isMobile ? 40 : 80;
        const flowersArray = [];
        const refs = [];

        for (let i = 0; i < num; i++) {
            const flowerRef = React.createRef<HTMLDivElement>();
            refs.push(flowerRef);

            const left = Math.random() * 90;
            const top = Math.random() * 90;
            const scale = 1 + Math.random() * 0.2;
            const rotate = Math.random() * 60;
            const theme =
                colorThemes[Math.floor(Math.random() * colorThemes.length)];

            flowersArray.push(
                <div
                    ref={flowerRef}
                    className="flower"
                    style={
                        {
                            left: `${left}%`,
                            top: `${top}%`,
                            animationDelay: `${i * 5}ms`,
                            "--rotation": `${rotate}deg`,
                            transform: `scale(${scale}) rotate(var(--rotation))`,
                            "--color-1": theme["--color-1"],
                            "--color-2": theme["--color-2"],
                            "--color-3": theme["--color-3"],
                            "--color-4": theme["--color-4"],
                        } as React.CSSProperties
                    }
                    key={i}
                >
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                </div>,
            );
        }
        flowersRef.current = refs;
        return flowersArray;
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: [0.1, 0.5, 1] },
        );

        flowersRef.current.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            flowersRef.current.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);

    return (
        <div className="flowers" ref={flowersContainerRef}>
            <div className="bunch">{flowers}</div>
        </div>
    );
};

export default React.memo(ZaBanquet);
