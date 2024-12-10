import React, { RefObject, useEffect, useRef } from "react";
import "./BlackHole.css";

const BlackHole: React.FC = () => {
    const back = useRef<HTMLCanvasElement>(null);
    const middle = useRef<HTMLCanvasElement>(null);
    const front = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasInit = (
            elem: RefObject<HTMLCanvasElement>,
        ): {
            canvas: HTMLCanvasElement | null;
            ctx: CanvasRenderingContext2D | null;
        } => {
            const canvas = elem.current;
            return { canvas, ctx: canvas ? canvas.getContext("2d") : null };
        };

        const { canvas: bac, ctx: b } = canvasInit(back);
        const { canvas: mid, ctx: m } = canvasInit(middle);
        const { canvas: fro, ctx: f } = canvasInit(front);

        if (!bac || !mid || !fro || !b || !m || !f) return;

        const w = 1500;
        const h = 1000;

        [bac, mid, fro].forEach((canvas) => {
            canvas.width = w;
            canvas.height = h;
        });

        class Particle {
            ox: number;
            oy: number;
            br: number;
            re: number;
            col: string;
            size: number;
            q: number;
            h2p: number;
            a: number;
            tail: { x: number; y: number }[];
            tailIndex: number;
            tl: number;

            constructor(x: number, y: number, r: number) {
                this.ox = x;
                this.oy = y;
                this.br = r;
                this.re = Math.random() * r;
                this.col = `rgba(255,${Math.floor(100 + Math.random() * 50)},80,0.5)`;
                this.size = Math.random() * 4;
                this.q = 1 / 3 + Math.random() * (1 / 2 - 1 / 3);
                this.h2p = 10;
                this.a = Math.random() * 2 * Math.PI;
                this.tl = Math.floor(Math.random() * 5 + 5);
                this.tail = Array.from({ length: this.tl }, () => ({
                    x: 0,
                    y: 0,
                }));
                this.tailIndex = 0;
                this.updatePosition();
            }

            updatePosition() {
                this.tail[this.tailIndex] = {
                    x:
                        this.ox +
                        (this.br + this.re + this.size + this.h2p) *
                            Math.cos(this.a),
                    y:
                        this.oy +
                        (this.br + this.re + this.size + this.h2p) *
                            this.q *
                            Math.sin(this.a),
                };
                this.tailIndex = (this.tailIndex + 1) % this.tl;
                this.a += (this.br - this.re) / 1000;
            }

            draw(ctx: CanvasRenderingContext2D) {
                this.tail.forEach(({ x, y }) => {
                    ctx.beginPath();
                    ctx.arc(x, y, this.size, 0, 2 * Math.PI);
                    ctx.fillStyle = this.col;
                    ctx.fill();
                });
            }
        }

        const particles = Array.from(
            { length: 540 },
            () => new Particle(w / 2, h / 2, 100),
        );

        const draw = () => {
            b.clearRect(0, 0, w, h);
            f.clearRect(0, 0, w, h);
            m.clearRect(0, 0, w, h);

            particles.forEach((particle) => {
                particle.updatePosition();
                particle.draw(b);
            });

            m.beginPath();
            m.arc(w / 2, h / 2, 100, 0, 2 * Math.PI);
            m.fillStyle = "black";
            m.fill();
        };

        const animate = () => {
            draw();
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            // Cleanup animation
            particles.length = 0;
        };
    }, []);

    return (
        <div className="black-hole">
            <canvas ref={back} className="back"></canvas>
            <canvas ref={middle} className="middle"></canvas>
            <canvas ref={front} className="front"></canvas>
        </div>
    );
};

export default React.memo(BlackHole);
