import React from "react";
import "./Retro.css";

interface IRetroProps {
    children?: React.ReactNode,
    style?: React.CSSProperties,
    className?: string
}

const Retro: React.FC<IRetroProps> = ({ children, className, style }) => {
    return (
        <div style={style ?? {}} className={`retro ${className ?? ""}`}>
            {children}
        </div>
    );
}

export default Retro;
