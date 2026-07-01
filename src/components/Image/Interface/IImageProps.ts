import { CSSProperties } from "react";

interface IImageProps {
    src?: string;
    className?: string;
    compression?: number;
    isLazyLoading?: boolean;
    style?: CSSProperties;
    alt?: string;
}

export default IImageProps;
