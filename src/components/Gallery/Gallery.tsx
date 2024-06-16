import React, { useEffect, useState } from "react";
import { IGalleryProps } from "./Interface/IGalleryProps";
import GalleryItem from "./GalleryItem/GalleryItem";
import "../Utility/MouseUtility";
import "./Gallery.css";

const Gallery: React.FC<IGalleryProps> = (props) => {
    const renderGalleryItems = (): React.ReactNode => {
        return props.content.map((item: any, index: number) => (
            <GalleryItem key={index} {...item} />
        ));
    };

    return (
        <>
            <div className="heading__wrapper">
                <h2>{props.heading}</h2>
            </div>
            <div className="gallery">{renderGalleryItems()}</div>
        </>
    );
};

export default Gallery;
