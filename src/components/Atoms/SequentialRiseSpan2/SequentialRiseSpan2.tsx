import { ISequentialRiseSpanProps } from "../SequentialRiseSpan/SequentialRiseSpan";
import React from "react";

const SequentialRiseSpan2: React.FC<ISequentialRiseSpanProps> = ({
  children,
  className
}) => {

  return (
    <div className={`sequential-rise-span ${className}`}>
      {children}
    </div>
  )
};

export default SequentialRiseSpan2;
