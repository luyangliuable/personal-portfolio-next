import React, { Component, createRef, RefObject } from "react";
import "./Card.css";
import { cardGradientEffect } from "../../components/Utility/MouseUtility";
import { isoDateFormatToString } from "../../components/Utility/StringUtility";
import TagCloud from "../TagCloud/TagCloud";
import InProgressBlock from "./InProgressBlock/InProgressBlock";
import Image from "../Image/Image";
import ICardProps from "./Interface/ICardProps";
import ICardState from "./Interface/ICardState";
import DynamicLoadQueue from "../../stores/DynamicLoadQueue/DynamicLoadQueue";
import { FaLock } from "react-icons/fa";

class Card extends Component<ICardProps, ICardState> {
    cardItemRef: RefObject<HTMLAnchorElement>;
    dynamicLoadQueue: DynamicLoadQueue;

    constructor(props: ICardProps) {
        super(props);
        this.cardItemRef = createRef();
        this.dynamicLoadQueue = DynamicLoadQueue.getInstance();

        this.state = {};
    }

    componentDidMount() {
        if (this.cardItemRef.current) {
            this.dynamicLoadQueue.addToQueue(this.cardItemRef.current);
        }
    }

    render() {
        const {
            link,
            in_progress,
            authorImage,
            image,
            author,
            heading,
            minuteRead,
            tags,
            date_created,
            locked,
        } = this.props;
        const displayMinuteRead = `${minuteRead || "X"} min read`;
        const displayDateCreated = date_created
            ? isoDateFormatToString(new Date(date_created))
            : "";
        // Locked card - same content but no href, lock icon, and disabled cursor
        if (locked) {
            return (
                <a
                    ref={this.cardItemRef}
                    onMouseMove={cardGradientEffect}
                    className="card card-item card-item--locked"
                >
                    <TagCloud tags={tags} />
                    <section className="card-item__content">
                        <h3 className="card-item__heading my-half font-bold">
                            {heading}
                            <span className="card-item__lock-icon">
                                <FaLock />
                            </span>
                        </h3>
                        <p className="card-item__label flex flex-row items-center">
                            {`${displayMinuteRead} | ${displayDateCreated}`}
                            {in_progress && <InProgressBlock />}
                        </p>
                    </section>
                    {image && (
                        <div className="card-image-preview__wrapper absolute overflow-hidden flex justify-center items-center">
                            <Image
                                compression={30}
                                src={image}
                                className="card-image-preview"
                                alt="Card Preview"
                            />
                        </div>
                    )}
                    <footer className="flex mt-5 relative items-center">
                        <Image
                            src={authorImage || ""}
                            className="user-image card-image--author-image"
                            alt={author || "Unknown"}
                        />
                        {author || "Unknown"}
                    </footer>
                </a>
            );
        }

        // Normal unlocked card
        if (
            link === undefined ||
            image === undefined ||
            authorImage === undefined
        )
            return null;
        return (
            <a
                ref={this.cardItemRef}
                onMouseMove={cardGradientEffect}
                className="card card-item"
                href={link}
            >
                <TagCloud tags={tags} />
                <section className="card-item__content">
                    <h3 className="card-item__heading my-half font-bold">
                        {heading}
                    </h3>
                    <p className="card-item__label flex flex-row items-center">
                        {`${displayMinuteRead} | ${displayDateCreated}`}
                        {in_progress && <InProgressBlock />}
                    </p>
                </section>
                {image && (
                    <div className="card-image-preview__wrapper absolute overflow-hidden flex justify-center items-center">
                        <Image
                            compression={30}
                            src={image}
                            className="card-image-preview"
                            alt="Card Preview"
                        />
                    </div>
                )}
                <footer className="flex mt-5 relative items-center">
                    <Image
                        src={authorImage}
                        className="user-image card-image--author-image"
                        alt={author}
                    />
                    {author}
                </footer>
            </a>
        );
    }
}

export default Card;
