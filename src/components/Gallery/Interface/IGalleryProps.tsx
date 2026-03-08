import IGalleryItemProps from "../GalleryItem/Interface/IGalleryItemProps";

export type GalleryItemBase = {
    name: string;
    description: string;
    image: string;
    link?: string;
    isLogo?: boolean;
    tags?: string[];
};

export type GalleryItemWithRepo = GalleryItemBase & {
    repoOwner: string;
    repoName: string;
};

export type GalleryItemWithoutRepo = GalleryItemBase & {
    repoOwner?: never;
    repoName?: never;
};

export type GalleryItem = GalleryItemWithRepo | GalleryItemWithoutRepo;

export interface IGalleryProps {
    content: IGalleryItemProps[];
    heading: string;
}
