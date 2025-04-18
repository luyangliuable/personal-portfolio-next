import React from "react";
import "./Retro.css";
import { cl } from "../Utility/LogicUtility";

interface IRetroProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
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
