import React, { useState, useEffect } from "react";
import "./Bento.css";
import { cl } from "../Utility/LogicUtility";

interface IBentoProps {
  children: React.ReactNode;
  className?: string;
  gap?: string;
}

interface IBentoItemProps {
  children: React.ReactNode;
  className?: string;
  rowSpan?: number;
  colSpan?: number;
}

const Bento: React.FC<IBentoProps> & { Item: React.FC<IBentoItemProps> } = ({
  children,
  className,
  gap = "0vw",
}) => {
  return (
    <div
      className={cl("bento-container", className)}
      style={{
        display: "grid",
      }}
    >
      {children}
    </div>
  );
};

const BentoItem: React.FC<IBentoItemProps> = ({
  children,
  className,
  rowSpan = 1,
  colSpan = 1,
}) => {
  const [adjustedColSpan, setAdjustedColSpan] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setAdjustedColSpan(1);
      } else {
        setAdjustedColSpan(colSpan);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [colSpan]);

  return (
    <>
      <div
        className={cl("bento-item", className)}
        style={{
          gridRow: `span ${rowSpan}`,
          gridColumn: `span ${adjustedColSpan}`,
        }}
      >
        {children}
        <div className="bento-item--left"></div>
        <div className="bento-item--bottom"></div>
      </div>
    </>
  );
};

Bento.Item = BentoItem;

export default Bento;
