import dynamic from "next/dynamic";

const Burger = dynamic(() => import("./Burger"), {
    loading: () => <div></div>,
    ssr: false,
});

export default Burger;
