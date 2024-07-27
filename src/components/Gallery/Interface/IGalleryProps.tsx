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

// TODO: use typescript AllOrNothing in latest version.
export type GalleryItemWithoutRepo = GalleryItemBase & {
  repoOwner?: undefined;
  repoName?: undefined;
};

export type GalleryItem = GalleryItemWithRepo | GalleryItemWithoutRepo;

export interface IGalleryProps {
  content: GalleryItem[];
  heading: string
}
