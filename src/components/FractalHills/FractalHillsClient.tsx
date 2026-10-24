"use client";

import dynamic from "next/dynamic";

// p5 reads window when imported, so the sketch must never render on the server.
const FractalHillsClient = dynamic(() => import("./FractalHills"), {
    ssr: false,
});

export default FractalHillsClient;
