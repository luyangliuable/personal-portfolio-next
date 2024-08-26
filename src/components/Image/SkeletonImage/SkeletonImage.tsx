import React from 'react';
import "./SkeletonImage.css";
import ISkeletonImageProps from "./Interface/ISkeletonImageProps";

const SkeletonImage: React.FC<ISkeletonImageProps> = ({ className, style }) => {
    return (
        <div className={`image-skeleton ${className}`} style={style}></div>
    );
}

export default SkeletonImage;
