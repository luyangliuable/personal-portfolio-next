"use client";
import React, { Component } from "react";
import { IGalleryProps } from "./Interface/IGalleryProps";
import IGalleryState from "./Interface/IGalleryState";
import GalleryItem from "./GalleryItem/GalleryItem";
import "../Utility/MouseUtility";
import "./Gallery.css";


class Gallery extends Component<IGalleryProps, IGalleryState> {
    galleryContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: IGalleryProps) {
        super(props);
    }

    renderGalleryItems(): React.ReactNode {
        return this.props.content.map((item: any, index: number) => (
            <GalleryItem key={index} {...item} />
        ))
    }

    render() {
        return (
            <>
                <div className="heading__wrapper"><h2>{this.props.heading}</h2></div>
                <div className="gallery-item__container">
                    {this.renderGalleryItems()}
                </div>
            </>
        );
    }
}

export default Gallery;
