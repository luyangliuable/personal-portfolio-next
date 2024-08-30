import React, { useRef, useEffect } from 'react';
import "./GolfedSierpinski.css";

const GolfedSierpinski = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const S = Math.sin;

        const animate = (t: number) => {
            t *= 0.0015;

            // Adjust canvas size as needed
            canvas.width = Math.min(114 * 2, window.innerWidth / 3);
            canvas.height = Math.min(114 * 2, window.innerWidth / 3);

            const squareSize = 4;  // New square size
            const spacing = 3;     // Adjust spacing if needed

            context.fillStyle = '#433';

            for (let i = 114; i--;) {
                for (let j = 66; j--;) {
                    // Compute the size of each square
                    const P = S(((j - i) & (j + i)) + t) * squareSize + squareSize;

                    // Adjust the position and size of the squares
                    context.fillRect(i * 2 * squareSize - P / 2, j * 2 * squareSize - P / 2, P, P);
                }
            }

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, []);

    return (
        <canvas className="golfed-sierpinski" ref={canvasRef}></canvas>
    );
};

export default GolfedSierpinski;
