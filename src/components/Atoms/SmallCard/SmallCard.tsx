import ICardProps from "../../Card/Interface/ICardProps";
import Image from "../../Image/Image";
import Link from "next/link";
import { cardGradientEffect } from "../../Utility/MouseUtility";
import { FaLock } from "react-icons/fa";
import "../../Card/Card.css";
import "./SmallCard.css";

const SmallCard: React.FC<ICardProps> = ({
    link,
    authorImage,
    image,
    author,
    heading,
    locked,
}) => {
    if (locked) {
        return (
            <div className="card small-card small-card--locked flex flex-row box-border justify-between items-center">
                <div className="w-6/12">
                    <h3 className="font-semibold text-sm text-gray-500">
                        {heading || "Content Unavailable"}
                    </h3>
                    <footer className="flex mt-5 relative text-sm text-gray-500">
                        <FaLock className="mr-2" />
                        Locked
                    </footer>
                </div>
                {image && (
                    <Image
                        compression={30}
                        className="small-card__image small-card__image--locked"
                        alt={heading || "Unavailable"}
                        src={image}
                    />
                )}
            </div>
        );
    }

    return (
        <Link
            href={link ?? ""}
            onMouseMove={cardGradientEffect}
            className="card small-card flex flex-row box-border justify-between items-center"
        >
            <div className="w-6/12">
                <h3 className="font-semibold text-sm">{heading}</h3>
                <footer className="flex mt-5 relative text-sm">
                    <Image
                        compression={5}
                        src={authorImage ?? ""}
                        className="user-image card-image--author-image"
                        alt="Author"
                    />
                    {author}
                </footer>
            </div>
            <Image
                compression={30}
                className="small-card__image"
                alt={heading}
                src={image ?? ""}
            />
        </Link>
    );
};

export default SmallCard;
