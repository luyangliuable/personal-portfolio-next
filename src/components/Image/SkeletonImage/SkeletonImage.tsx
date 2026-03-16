import React, { forwardRef } from "react";
import "./SkeletonImage.css";
import ISkeletonImageProps from "./Interface/ISkeletonImageProps";
import { cl } from "../../../components/Utility/LogicUtility";

const SkeletonImage = forwardRef<HTMLDivElement, ISkeletonImageProps>(
    ({ className, style, hasError }, ref) => {
        return (
            <div
                ref={ref}
                className={cl("image-skeleton", className, {
                    "image-skeleton--error": hasError,
                })}
                style={style}
            ></div>
        );
    },
);

SkeletonImage.displayName = "SkeletonImage";

export default React.memo(SkeletonImage);
