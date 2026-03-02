"use client";

import React, { useEffect, useRef, RefObject } from "react";
import "./FractalHills.css";
import p5 from "p5/lib/p5.js";

const FractalHills = () => {
    const sketchRef: RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        const sketch = (p: p5) => {
            let cols: number, rows: number;
            let scl = 40;
            let w = 2000;
            let h = 1600;
            let flying = 0;
            let terrain: number[][] = [];
            let colorTheme = "invertedMonochrome";

            const speedVal = 0.002;

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
                cols = w / scl;
                rows = h / scl;

                for (let x: number = 0; x < cols; x++) {
                    terrain[x] = [];
                    for (let y = 0; y < rows; y++) {
                        terrain[x][y] = 0;
                    }
                }
            };

            p.draw = () => {
                flying -= speedVal;
                let yoff = flying;
                const centerX = cols / 2;
                const centerY = rows / 2;
                const flatRadius = Math.min(cols, rows) / 5;
                const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);

                for (let y = 0; y < rows; y++) {
                    let xoff = 0;
                    for (let x = 0; x < cols; x++) {
                        const distToCenter = Math.abs(x - centerX);
                        const maxY = rows;
                        const heightScale = p.map(y, maxY, maxY - 13, 0, 1);
                        const distScale = distToCenter < flatRadius ? 0.1 : 1;
                        const gullyEffect = p.map(
                            distToCenter,
                            flatRadius,
                            maxDist,
                            0.1,
                            1.5,
                        );

                        if (y > maxY - 13) {
                            terrain[x][y] = p.map(
                                p.noise(xoff, yoff),
                                0,
                                1,
                                -100 * heightScale * distScale * gullyEffect,
                                heightVal *
                                    heightScale *
                                    distScale *
                                    gullyEffect,
                            );
                        } else if (distToCenter < flatRadius) {
                            terrain[x][y] = p.map(
                                p.noise(xoff, yoff),
                                0,
                                1,
                                -100 * 0.1,
                                heightVal * 0.1,
                            );
                        } else {
                            const gullyEffect = p.map(
                                distToCenter,
                                flatRadius,
                                maxDist,
                                0.1,
                                1.5,
                            );
                            terrain[x][y] = p.map(
                                p.noise(xoff, yoff),
                                0,
                                1,
                                -100 * gullyEffect,
                                heightVal * gullyEffect,
                            );
                        }

                        xoff += 0.2;
                    }
                    yoff += 0.2;
                }

                p.background(backgroundColorVal);
                p.translate(0, 50);
                p.rotateX(p.PI / 2.5);
                p.stroke(120);
                p.strokeWeight(0.5);
                /* p.translate(-w / 2, -3.5 * p.height) */
                p.translate(-w / 2, -h / 2);

                for (let y = 0; y < rows - 1; y++) {
                    p.beginShape(p.TRIANGLE_STRIP);
                    for (let x = 0; x < cols; x++) {
                        let height = terrain[x][y];
                        let terrainColor = getTerrainColor(height);
                        p.fill(terrainColor);
                        p.vertex(x * scl, y * scl, height);
                        p.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
                    }
                    p.endShape();
                }
            };

            function getTerrainColor(height: number) {
                let normalizedHeight = p.map(height, -100, heightVal, 0, 1);

                switch (colorTheme) {
                    case "heatmap":
                        return getHeatmapColor(normalizedHeight);
                    case "rainbow":
                        return getRainbowColor(normalizedHeight);
                    case "invertedMonochrome":
                        return getInvertedMonochromeColor(normalizedHeight);
                    case "monochrome":
                        return getMonochromeColor(normalizedHeight);
                    case "red":
                        return p.color(255 * normalizedHeight, 0, 0);
                    case "green":
                        return p.color(0, 255 * normalizedHeight, 0);
                    case "blue":
                        return p.color(0, 0, 255 * normalizedHeight);
                    case "temperature":
                        return getTemperatureColor(normalizedHeight);
                    case "viridis":
                        return getViridisColor(normalizedHeight);
                    case "magma":
                        return getMagmaColor(normalizedHeight);
                    case "heat":
                        return getHeatColor(normalizedHeight);
                    case "brewer-ygb":
                        return getBrewerYGBColor(normalizedHeight);
                    default:
                        return p.color(200);
                }
            }

            function getHeatmapColor(normalizedHeight: number) {
                let c1 = p.color(0, 0, 255); // Blue for lowest
                let c2 = p.color(0, 255, 255); // Cyan
                let c3 = p.color(0, 255, 0); // Green
                let c4 = p.color(255, 255, 0); // Yellow
                let c5 = p.color(255, 0, 0); // Red for highest

                if (normalizedHeight < 0.25) {
                    return p.lerpColor(c1, c2, normalizedHeight * 4);
                } else if (normalizedHeight < 0.5) {
                    return p.lerpColor(c2, c3, (normalizedHeight - 0.25) * 4);
                } else if (normalizedHeight < 0.75) {
                    return p.lerpColor(c3, c4, (normalizedHeight - 0.5) * 4);
                } else {
                    return p.lerpColor(c4, c5, (normalizedHeight - 0.75) * 4);
                }
            }

            function getRainbowColor(normalizedHeight: number) {
                return p.color(normalizedHeight * 360, 100, 100);
            }

            function getMonochromeColor(normalizedHeight: number) {
                return p.color(normalizedHeight * 800);
            }

            function getInvertedMonochromeColor(normalizedHeight: number) {
                return p.color((1 - normalizedHeight) * 360);
            }

            function getTemperatureColor(normalizedHeight: number) {
                let cold = p.color(0, 0, 255); // Blue for cold
                let warm = p.color(255, 0, 0); // Red for warm
                return p.lerpColor(cold, warm, normalizedHeight);
            }

            function getViridisColor(normalizedHeight: number) {
                let c1 = p.color(68, 1, 84); // Dark purple
                let c2 = p.color(72, 40, 120); // Purple
                let c3 = p.color(62, 74, 137); // Blue
                let c4 = p.color(49, 104, 142); // Light blue
                let c5 = p.color(38, 130, 142); // Teal
                let c6 = p.color(31, 158, 137); // Green
                let c7 = p.color(53, 183, 121); // Light green
                let c8 = p.color(109, 205, 89); // Yellow-green
                let c9 = p.color(180, 222, 44); // Yellow
                let c10 = p.color(253, 231, 37); // Bright yellow

                if (normalizedHeight < 0.1)
                    return p.lerpColor(c1, c2, normalizedHeight * 10);
                if (normalizedHeight < 0.2)
                    return p.lerpColor(c2, c3, (normalizedHeight - 0.1) * 10);
                if (normalizedHeight < 0.3)
                    return p.lerpColor(c3, c4, (normalizedHeight - 0.2) * 10);
                if (normalizedHeight < 0.4)
                    return p.lerpColor(c4, c5, (normalizedHeight - 0.3) * 10);
                if (normalizedHeight < 0.5)
                    return p.lerpColor(c5, c6, (normalizedHeight - 0.4) * 10);
                if (normalizedHeight < 0.6)
                    return p.lerpColor(c6, c7, (normalizedHeight - 0.5) * 10);
                if (normalizedHeight < 0.7)
                    return p.lerpColor(c7, c8, (normalizedHeight - 0.6) * 10);
                if (normalizedHeight < 0.8)
                    return p.lerpColor(c8, c9, (normalizedHeight - 0.7) * 10);
                return p.lerpColor(c9, c10, (normalizedHeight - 0.8) * 5);
            }

            function getMagmaColor(normalizedHeight: number) {
                let c1 = p.color(0, 0, 4); // Black
                let c2 = p.color(40, 0, 41); // Dark purple
                let c3 = p.color(87, 15, 109); // Purple
                let c4 = p.color(135, 26, 137); // Magenta
                let c5 = p.color(184, 55, 121); // Pink
                let c6 = p.color(231, 104, 93); // Light pink
                let c7 = p.color(251, 180, 185); // Very light pink

                if (normalizedHeight < 0.16)
                    return p.lerpColor(c1, c2, normalizedHeight * 6.25);
                if (normalizedHeight < 0.33)
                    return p.lerpColor(
                        c2,
                        c3,
                        (normalizedHeight - 0.16) * 5.88,
                    );
                if (normalizedHeight < 0.5)
                    return p.lerpColor(
                        c3,
                        c4,
                        (normalizedHeight - 0.33) * 5.88,
                    );
                if (normalizedHeight < 0.66)
                    return p.lerpColor(c4, c5, (normalizedHeight - 0.5) * 6.25);
                if (normalizedHeight < 0.83)
                    return p.lerpColor(
                        c5,
                        c6,
                        (normalizedHeight - 0.66) * 5.88,
                    );
                return p.lerpColor(c6, c7, (normalizedHeight - 0.83) * 5.88);
            }

            function getHeatColor(normalizedHeight: number) {
                let c1 = p.color(0, 0, 0); // Black
                let c2 = p.color(128, 0, 0); // Dark red
                let c3 = p.color(255, 0, 0); // Red
                let c4 = p.color(255, 128, 0); // Orange
                let c5 = p.color(255, 255, 0); // Yellow
                let c6 = p.color(255, 255, 255); // White

                if (normalizedHeight < 0.2)
                    return p.lerpColor(c1, c2, normalizedHeight * 5);
                if (normalizedHeight < 0.4)
                    return p.lerpColor(c2, c3, (normalizedHeight - 0.2) * 5);
                if (normalizedHeight < 0.6)
                    return p.lerpColor(c3, c4, (normalizedHeight - 0.4) * 5);
                if (normalizedHeight < 0.8)
                    return p.lerpColor(c4, c5, (normalizedHeight - 0.6) * 5);
                return p.lerpColor(c5, c6, (normalizedHeight - 0.8) * 5);
            }

            function getBrewerYGBColor(normalizedHeight: number) {
                let c1 = p.color(8, 29, 88); // Dark blue
                let c2 = p.color(37, 52, 148); // Blue
                let c3 = p.color(34, 94, 168); // Light blue
                let c4 = p.color(29, 145, 192); // Cyan
                let c5 = p.color(65, 182, 196); // Light cyan
                let c6 = p.color(127, 205, 187); // Teal
                let c7 = p.color(199, 233, 180); // Light green
                let c8 = p.color(237, 248, 177); // Yellow-green
                let c9 = p.color(255, 255, 217); // Light yellow

                if (normalizedHeight < 0.125)
                    return p.lerpColor(c1, c2, normalizedHeight * 8);
                if (normalizedHeight < 0.25)
                    return p.lerpColor(c2, c3, (normalizedHeight - 0.125) * 8);
                if (normalizedHeight < 0.375)
                    return p.lerpColor(c3, c4, (normalizedHeight - 0.25) * 8);
                if (normalizedHeight < 0.5)
                    return p.lerpColor(c4, c5, (normalizedHeight - 0.375) * 8);
                if (normalizedHeight < 0.625)
                    return p.lerpColor(c5, c6, (normalizedHeight - 0.5) * 8);
                if (normalizedHeight < 0.75)
                    return p.lerpColor(c6, c7, (normalizedHeight - 0.625) * 8);
                if (normalizedHeight < 0.875)
                    return p.lerpColor(c7, c8, (normalizedHeight - 0.75) * 8);
                return p.lerpColor(c8, c9, (normalizedHeight - 0.875) * 8);
            }

            function windowResized() {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            }

            window.addEventListener("resize", windowResized);
        };

        let p5Instance: p5;
        if (sketchRef.current) p5Instance = new p5(sketch, sketchRef.current);
        return () => p5Instance.remove();
    }, []);

    return <div ref={sketchRef} className="bg-[red] h-screen"></div>;
};

export default FractalHills;
