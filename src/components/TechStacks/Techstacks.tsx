import { FaReact, FaCss3Alt, FaHtml5 } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";

const TechStack = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="relative">
                <svg
                    className="absolute"
                    width="400"
                    height="400"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="black"
                        strokeWidth="0.2"
                        fill="none"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="30"
                        stroke="black"
                        strokeWidth="0.2"
                        fill="none"
                    />
                    <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="4"
                        fill="black"
                    >
                        <textPath href="#pathOuter">
                            <tspan dy="-2">Frontend Tech Stacks</tspan>
                        </textPath>
                    </text>
                    <path
                        id="pathOuter"
                        d="M 50,10 a 40,40 0 1,1 -0.1,0"
                        fill="none"
                    />
                    <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="4"
                        fill="black"
                    >
                        <textPath href="#pathInner">
                            <tspan dy="-2">Backend Tech Stacks</tspan>
                        </textPath>
                    </text>
                    <path
                        id="pathInner"
                        d="M 50,20 a 30,30 0 1,1 -0.1,0"
                        fill="none"
                    />
                </svg>
                <div className="absolute w-[400px] h-[400px]">
                    <FaReact
                        className="
                        text-4xl
                        bg-[#DDD]
                        absolute
                        left-[45%]
                        top-[5%]
                        p-1
                        rounded-md
                    "
                    />
                    <FaCss3Alt
                        className="
                        text-4xl
                        bg-[#DDD]
                        absolute
                        left-[32%]
                        top-[8%]
                        p-1
                        rounded-md
                        "
                    />
                    <FaHtml5
                        className="
                        text-4xl
                        bg-[#DDD]
                        absolute
                        left-[20%]
                        top-[14%]
                        p-1
                        rounded-md
                        "
                    />
                    <SiTailwindcss
                        className="
                        text-4xl
                        bg-[#DDD]
                        absolute
                        left-[11%]
                        top-[25%]
                        p-1
                        rounded-md
                        "
                    />
                </div>
            </div>
        </div>
    );
};

export default TechStack;
