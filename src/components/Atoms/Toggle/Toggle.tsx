import "./Toggle.css";
import React from "react";

interface IToggleProps {
    setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
    disabled?: boolean;
    toggleState: boolean;
}

const Toggle: React.FC<IToggleProps> = ({ setToggleState, toggleState, disabled }) => {

    const toggleClassName = ["toggle"];
    const toggleContainerClassName = ["toggle--container flex flex-row items-center justify-center"];

    if (toggleState) {
        toggleClassName.push("toggle--on");
    }

    if (disabled) {
        toggleContainerClassName.push("disabled");
    }

    const handleClick = () => {
        if (disabled) return;
        setToggleState(( prev: boolean ) => !prev);
    }

    return (
        <div onClick={() => handleClick()} className={toggleContainerClassName.join(" ")}>
            <span className="text-center">Display Leetcode Posts?</span>
            <div className={toggleClassName.join(" ")}>
                <div className="toggle__inner-circle" />
            </div>
        </div>
    );
}

export default Toggle;
