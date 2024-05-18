export type GalleryItem = {
    name: string,
    description: string,
    image: string,
    link?: string,
    isLogo?: boolean,
    tags?: string[]
}

export interface IGalleryProps {
    content: GalleryItem[];
    heading: string
}
