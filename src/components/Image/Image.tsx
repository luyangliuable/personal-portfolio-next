"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SkeletonImage from "./SkeletonImage/SkeletonImage";
import IImageProps from "./Interface/IImageProps";
import ImageRepository from "../../repositories/ImageRepository";
import { default as NextImage } from "next/image";
import { cl } from "../Utility/LogicUtility";
import "./Image.css";

const DEFAULT_IMAGE_ID = "651942aaf9b642fb30be59ae";

const Image: React.FC<IImageProps> = ({
    compression,
    src,
    isLazyLoading,
    className,
    alt,
    style,
}) => {
    const imageRepository = ImageRepository.getInstance();
    const [fetchedImageUrl, setFetchedImageUrl] = useState<string | undefined>(
        undefined,
    );
    const [isInView, setIsInView] = useState<boolean>(false);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const defaultImageAlt = "";
    const imageRef = useRef(null);

    const updateImage = useCallback(() => {
        try {
            const imageId = src ?? DEFAULT_IMAGE_ID;
            const imageUrl = imageRepository.getImageUrl(imageId, compression);
            if (imageUrl === fetchedImageUrl) return;
            setIsImageLoaded(false);
            setFetchedImageUrl(imageUrl);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    }, [compression, fetchedImageUrl, imageRepository, src]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animation");
                        setIsInView(true);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "20%" },
        );

        const imageElement = imageRef.current;
        if (imageElement) {
            observer.observe(imageElement);
        }

        return () => {
            if (imageElement) {
                observer.unobserve(imageElement);
            }
        };
    }, []);

    useEffect(() => {
        if (isInView || isLazyLoading === false) updateImage();
    }, [isInView, isLazyLoading, updateImage]);

    if (!fetchedImageUrl) {
        return (
            <SkeletonImage ref={imageRef} className={className} style={style} />
        );
    }

    return (
        <NextImage
            style={style}
            loading="lazy"
            ref={imageRef}
            width="100"
            height="100"
            className={cl(className, {
                "image-skeleton animation": !isImageLoaded,
            })}
            src={fetchedImageUrl}
            alt={alt ?? defaultImageAlt}
            onLoad={() => setIsImageLoaded(true)}
        />
    );
};

export default Image;
