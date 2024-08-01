import { CSSProperties } from 'react';

interface IGalleryItemPropsBase {
  name?: string;
  action?: string;
  subheading?: string;
  className?: string;
  image?: string;
  description?: string;
  dateCreated?: string;
  minuteRead?: number;
  link?: string;
  type?: "blog" | "project" | "tool" | "url" | "none" | "md";
  key?: number | string;
  style?: CSSProperties;
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

// TODO: Use new typescript AllOrNothing.
type IGalleryItemProps = IGalleryItemPropsWithRepo | IGalleryItemPropsWithoutRepo;

export default IGalleryItemProps;
