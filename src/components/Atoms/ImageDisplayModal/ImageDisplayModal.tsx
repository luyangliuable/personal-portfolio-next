import React, { Dispatch, SetStateAction } from "react"
import { createPortal } from 'react-dom';
import "./ImageDisplayModal.css";

interface IImageDisplayModalProps {
    image: string
    description: string
    showModal: Boolean
    setShowModal: Dispatch<SetStateAction<Boolean>>
}


const ImageDisplayModal: React.FC<IImageDisplayModalProps> = ({ image, description, setShowModal, showModal }) => {
    return (
        <>
            {showModal &&
                createPortal(
                    (
                        <div
                            className="image-display-modal--container flex justify-center items-center"
                            onClick={(e) => {
                                if ((e.target as HTMLDivElement).className.includes("image-display-modal--container"))
                                    setShowModal(false);
                                e.stopPropagation();
                            }}>
                            <div className="image-display-modal flex flex-col justify-center items-start">
                                <div className="image-display-modal--handle-close"
                                    onClick={(e) => {
                                        setShowModal(false)
                                        e.stopPropagation();
                                    }
                                    }></div>
                                <div className="image-display-modal--image position-relative"><img alt="" src={image} /></div>

                                <div className="image-display-modal--description">{description}</div>
                            </div>
                        </div>
                    ),
                    document.body
                )}
        </>
    )
}

export default ImageDisplayModal;
