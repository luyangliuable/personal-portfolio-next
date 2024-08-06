import React from "react";
import ICardProps from "../../Card/Interface/ICardProps";
import Image from "../../Image/Image";
import Link from "next/link";
import { cardGradientEffect } from "../../Utility/MouseUtility";
import "../../Card/Card.css";
import "./SmallCard.css";

const SmallCard: React.FC<ICardProps> = ({ link, authorImage, image, author, heading }) => {
    return (
        <Link href={link ?? ""} onMouseMove={cardGradientEffect} className="card small-card flex flex-row box-border justify-between items-center">
            <div className="w-half">
                <h3>{heading}</h3>
                <footer className="flex mt-5 position-relative">
                    <Image compression={5} src={authorImage ?? ""} className="user-image card-image--author-image" alt="Author" />
                    {author}
                </footer>
            </div>
            <Image compression={30} className="small-card__image" alt={heading} src={image ?? ""} />
        </Link>
    )
}

export default SmallCard;
