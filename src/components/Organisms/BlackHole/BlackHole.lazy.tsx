import dynamic from "next/dynamic";

const BlackHole = dynamic(() => import("./BlackHole"), {
    loading: () => <div></div>,
    ssr: false,
});

export default BlackHole;
