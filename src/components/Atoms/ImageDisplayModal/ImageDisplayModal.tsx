"use client";

import React, { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import "./ImageDisplayModal.css";
import Image from "../../Image/Image";

interface IImageDisplayModalProps {
    image: string;
    description: string;
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ImageDisplayModal: React.FC<IImageDisplayModalProps> = ({
    image,
    description,
    setShowModal,
    showModal,
}) => {
    const removeQueryParams = (url: string): string => {
        try {
            const parsedUrl = new URL(url);
            parsedUrl.search = "";
            return parsedUrl.toString();
        } catch (error) {
            console.error("Invalid URL", error);
            return url;
        }
    };

    const sanitizedImage = removeQueryParams(image);

    return (
        <>
            {showModal &&
                createPortal(
                    <button
                        type="button"
                        className="image-display-modal--container flex justify-center items-center"
                        onClick={(e) => {
                            if (
                                (e.target as HTMLButtonElement).className.includes(
                                    "image-display-modal--container",
                                )
                            )
                                setShowModal(false);
                            e.stopPropagation();
                        }}
                    >
                        <div className="image-display-modal flex flex-col justify-center items-start">
                            <button
                                type="button"
                                className="image-display-modal--handle-close"
                                onClick={(e) => {
                                    setShowModal(false);
                                    e.stopPropagation();
                                }}
                                aria-label="Close modal"
                            ></button>
                            <div className="image-display-modal--image relative">
                                <Image alt="" src={sanitizedImage} />
                            </div>
                            <div className="image-display-modal--description">
                                {description}
                            </div>
                        </div>
                    </button>,
                    document.body,
                )}
        </>
    );
};

export default ImageDisplayModal;
