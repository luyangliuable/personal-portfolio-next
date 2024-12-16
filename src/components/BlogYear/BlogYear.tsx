import React, { useEffect, useRef, useState } from "react";
import "./BlogYear.css";

const BlogYear: React.FC<{ year: string }> = ({ year }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !inView) {
                        setInView(true);
                    } else {
                        setInView(false);
                    }
                });
            },
            { threshold: 1 },
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className={`relative flex items-center blog__year ${inView ? "blog__year--animate" : ""}`}
        >
            <span className="absolute left-10 text-3xl">{year}</span>
        </div>
    );
};

export default BlogYear;
