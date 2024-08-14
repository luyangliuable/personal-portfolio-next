"use client";

import React from "react";
import { IGalleryProps } from "./Interface/IGalleryProps";
import GalleryItem from "./GalleryItem/GalleryItem";
import "../Utility/MouseUtility";
import "./Gallery.css";
import Bento from "../Bento/Bento";

const Gallery: React.FC<IGalleryProps> = (props) => {

    const renderGalleryItems = (): React.ReactNode => {
        return props.content.map((item: any, index: number) => {
            if (index == 0) {
                return (
                    <Bento.Item key={index} colSpan={2}>
                        <GalleryItem {...item} />
                    </Bento.Item>
                )
            }

            if (index == 1) {
                return (
                    <Bento.Item key={index} rowSpan={2} colSpan={2}>
                        <GalleryItem {...item} />
                    </Bento.Item>
                )
            }

            return (
                <Bento.Item key={index} colSpan={1}>
                    <GalleryItem {...item} />
                </Bento.Item>
            )
        });
    };

    return (
        <>
            <div className="gallery">
                <div className="heading__wrapper"><h2>{props.heading}</h2></div>
                <Bento gap="1rem">
                    {renderGalleryItems()}
                </Bento>
            </div>
        </>
    );
};

export default Gallery;
