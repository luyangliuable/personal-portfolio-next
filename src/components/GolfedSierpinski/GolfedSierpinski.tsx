"use client";

import { useRef, useEffect, useState } from "react";
import "./GolfedSierpinski.css";

const GolfedSierpinski = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [size, setSize] = useState<number>(0);

    useEffect(() => {
        const update = () => {
            setSize(Math.max(114, globalThis.innerWidth / 8));
        };

        if (typeof globalThis !== "undefined") {
            globalThis.addEventListener("resize", update);
        }

        update();

        return () => {
            if (typeof globalThis !== "undefined") {
                globalThis.removeEventListener("resize", update);
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        const S = Math.sin;

        const resizeCanvas = () => {
            (canvas.width = size), (canvas.height = size);
        };

        const animate = (t: number) => {
            t *= 0.0015;

            resizeCanvas();

            const squareSize = 4; // New square size

            context.fillStyle = "#433";

            for (let i = 114; i--; ) {
                for (let j = 66; j--; ) {
                    const P =
                        S(((j - i) & (j + i)) + t) * squareSize + squareSize;
                    context.fillRect(
                        i * 2 * squareSize - P / 2,
                        j * 2 * squareSize - P / 2,
                        P,
                        P,
                    );
                }
            }

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        globalThis.addEventListener("resize", resizeCanvas);
        return () => {
            globalThis.removeEventListener("resize", resizeCanvas);
        };
    }, [size]);

    return (
        <canvas
            className="golfed-sierpinski"
            ref={canvasRef}
            width={size}
            height={size}
        ></canvas>
    );
};

export default GolfedSierpinski;
