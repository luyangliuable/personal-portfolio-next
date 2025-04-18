import type { Metadata } from "next";
import React from "react";
import "./ThreeDPrintingGallery.css";
import HeroHeader from "../../../components/HeroHeader/HeroHeader";
import Gallery from "../../../components/Gallery/Gallery";
import { GalleryItem } from "../../../components/Gallery/Interface/IGalleryProps";

export const metadata: Metadata = {
  title: "Luyang's Website | 3d Printing",
  description: "",
};

const heroHeaderContent = Object.freeze({
  heading: "3D Printing",
  description: "",
});

const content: GalleryItem[] = [
  {
    name: "3d Printed Swivel Arm",
    description:
      "3D-printed arm I designed using solidworks that can swivel around: it was used on a robot as the ultimate payload handler",
    image: "https://llcode.tech/api/image/650516c6f9b642fb30be599a",
  },
  {
    name: "3d Printed Dino",
    description: "A 3D-printed dinosaur with a rhythmic rattle exoskeleton",
    image: "https://llcode.tech/api/image/65051a29f9b642fb30be599b",
  },
  {
    name: "3d Printed Maneki Neko",
    description: "",
    image: "https://llcode.tech/api/image/650502c8f9b642fb30be5999",
  },
  {
    name: "CBA logo with nps+30",
    description: "",
    image: "https://llcode.tech/api/image/6725e5bd18eb5f86ea13b542",
  },
];

const ThreeDPrintingGallery: React.FC<{}> = () => {
  const { heading, description } = heroHeaderContent;
  return (
    <main>
      <HeroHeader heading={heading} description={description} />
      <Gallery content={content} heading="3D Printing Gallery" />
    </main>
  );
};

export default ThreeDPrintingGallery;
