import type { ReactNode, CSSProperties } from "react";
import "./Retro.css";
import { cl } from "../Utility/LogicUtility";

interface IRetroProps {
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
    showBorder?: boolean;
}

const Retro: React.FC<IRetroProps> = ({
    children,
    className,
    style,
    showBorder,
}) => {
    return (
        <div
            style={style ?? {}}
            className={cl("retro", className, {
                "retro--show-border": true,
            })}
        >
            {children}
        </div>
    );
};

export default Retro;
