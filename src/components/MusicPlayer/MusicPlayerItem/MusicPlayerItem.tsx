import Image from "../../Image/Image";
import { cardGradientEffect } from "../../Utility/MouseUtility";

interface IMusicPlayerItemProps {
    imageSrc?: string;
    imageSrcAlt?: string;
    artistName: string;
    length: string;
    musicTitle: string;
}

const MusicPlayerItem: React.FC<IMusicPlayerItemProps> = ({
    imageSrc,
    imageSrcAlt,
    artistName,
    length,
    musicTitle,
}) => {
    return (
        <article
            onMouseMove={cardGradientEffect}
            className="card music-player--item flex flex-column justify-start items-center relative"
        >
            <div className="album-cover">
                <Image
                    src={
                        imageSrc ??
                        "https://live-production.wcms.abc-cdn.net.au/a362273509f7eccdcf362bb73b3b006d?impolicy=wcms_crop_resize&cropH=788&cropW=1400&xPos=0&yPos=0&width=862&height=485"
                    }
                    alt={imageSrcAlt}
                />
            </div>
            <div className="music-player--metadata relative flex flex-col justify-start items-start">
                <h3 className="m-0">{musicTitle}</h3>
                <div className="flex justify-between">
                    <span>{artistName}</span>
                    <span>{length}</span>
                </div>
            </div>
        </article>
    );
};

export default MusicPlayerItem;
