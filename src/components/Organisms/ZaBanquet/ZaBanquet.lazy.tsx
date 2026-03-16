import dynamic from "next/dynamic";

const ZaBanquet = dynamic(() => import("./ZaBanquet"), {
    loading: () => <div></div>,
    ssr: false,
});

export default ZaBanquet;
