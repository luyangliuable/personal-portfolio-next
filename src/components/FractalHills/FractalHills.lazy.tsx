import dynamic from "next/dynamic";

const FractalHills = dynamic(() => import("./FractalHills"), {
    loading: () => <div>Loading visualization...</div>,
    ssr: false,
});

export default FractalHills;
