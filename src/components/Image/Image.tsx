import React, { useEffect, useRef, useState } from 'react';
import SkeletonImage from './SkeletonImage/SkeletonImage';
import IImageProps from './Interface/IImageProps';
import ImageRepository from "../../repositories/ImageRepository";
import { default as NextImage } from 'next/image';
import "./Image.css";

const Image: React.FC<IImageProps> = (props) => {
    const imageRepository = ImageRepository.getInstance();
    const [fetchedImageUrl, setFetchedImageUrl] = useState<string | undefined>(undefined);
    const [isInView, setIsInView] = useState<boolean>(false);
    const defaultImageAlt = "You are blind";
    const imageRef = useRef(null);

    const defaultProps = {
        defaultImageId: "651942aaf9b642fb30be59ae",
    };

    const updateImage = async () => {
        try {
            const imageId = props.src ?? defaultProps!.defaultImageId;
            const [imageUrl] = await Promise.all([
                imageRepository.getImageById(imageId, props.compression),
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
            { threshold: 1 }
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
        if (isInView) updateImage();
    }, [props.src, isInView]);

    let { className, alt } = props;
    alt = alt ?? defaultImageAlt;

    if (!fetchedImageUrl) {
        return (<SkeletonImage ref={imageRef} className={props.className} />);
    }

    return (
        <NextImage loading="lazy" ref={imageRef} width="100" height="100" className={className} src={fetchedImageUrl} alt={alt} />
    );
};

export default Image;
