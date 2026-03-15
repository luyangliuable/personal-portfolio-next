import dynamic from "next/dynamic";

const PixelBlast = dynamic(() => import("./PixelBlast"), {
    loading: () => <div>Loading animation...</div>,
    ssr: false,
});

export default PixelBlast;
