"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import SkeletonImage from "./SkeletonImage/SkeletonImage";
import IImageProps from "./Interface/IImageProps";
import ImageRepository from "../../repositories/ImageRepository";
import { default as NextImage } from "next/image";
import { cl } from "../Utility/LogicUtility";
import "./Image.css";

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
    const defaultImageAlt = "";
    const imageRef = useRef(null);

    const defaultProps = {
        defaultImageId: "651942aaf9b642fb30be59ae",
    };

    const updateImage = async () => {
        if (fetchedImageUrl) return;
        try {
            const imageId = src ?? defaultProps.defaultImageId;
            const [imageUrl] = await Promise.all([
                imageRepository.getImageById(imageId, compression),
            ]);
            setFetchedImageUrl(imageUrl);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isInView) {
                        entry.target.classList.add("animation");
                        setIsInView(true);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "20%" },
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            if (imageRef.current) {
                observer.unobserve(imageRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isInView || isLazyLoading === false) updateImage();
    }, [src, isInView]);

    if (!fetchedImageUrl) {
        return <SkeletonImage ref={imageRef} className={className} />;
    }

    const memoizedNextImage = (
        <NextImage
            style={style}
            loading="lazy"
            ref={imageRef}
            width="100"
            height="100"
            className={cl(className, { animation: isLazyLoading === false })}
            src={fetchedImageUrl}
            alt={alt ?? defaultImageAlt}
        />
    );

    return memoizedNextImage;
};

export default Image;
