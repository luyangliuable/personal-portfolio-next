import Image from "../../Image/Image";

const MusicPlayerItem = () => {
    return (
        <div className="music-player--item flex flex-column justify-start items-center position-relative">
            <div className="album-cover">
                <Image
                    src="https://live-production.wcms.abc-cdn.net.au/a362273509f7eccdcf362bb73b3b006d?impolicy=wcms_crop_resize&cropH=788&cropW=1400&xPos=0&yPos=0&width=862&height=485"
                    alt="" />
            </div>
            <div className="music-player--metadata position-relative flex flex-col justify-start items-start">
                <h3 className="m-0">Test Music</h3>
                <div className="flex justify-between">
                    <span>Artist ABC</span>
                    <span>03:10</span>
                </div>
            </div>
        </div>
    )
}

export default MusicPlayerItem;
