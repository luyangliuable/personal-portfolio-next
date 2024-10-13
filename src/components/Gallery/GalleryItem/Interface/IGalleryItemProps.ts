import { CSSProperties } from "react";

interface IGalleryItemPropsBase {
    name?: string;
    action?: string;
    subheading?: string;
    className?: string;
    image?: string;
    imageOverlay?: any;
    description?: string;
    dateCreated?: string;
    minuteRead?: number;
    link?: string;
    type?: "blog" | "project" | "tool" | "url" | "none" | "md";
    key?: number | string;
    style?: CSSProperties;
    metadata?: {
        value: string | number | React.ReactNode;
        icon?: React.ReactNode;
        callback?: (val: string | number | React.ReactNode) => React.ReactNode;
    }[];
    tags?: string[];
}

interface IGalleryItemPropsWithRepo extends IGalleryItemPropsBase {
    repoOwner: string;
    repoName: string;
}

interface IGalleryItemPropsWithoutRepo extends IGalleryItemPropsBase {
    repoOwner?: undefined;
    repoName?: undefined;
}

type IGalleryItemProps =
    | IGalleryItemPropsWithRepo
    | IGalleryItemPropsWithoutRepo;

export default IGalleryItemProps;
