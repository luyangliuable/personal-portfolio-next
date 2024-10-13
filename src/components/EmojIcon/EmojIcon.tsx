import React from "react";
import "./EmojIcon.css";
import { cl } from "../Utility/LogicUtility";

interface IEmojIconProps {
    emojis: string[];
    style?: React.CSSProperties;
}

const generatePastelColorFromEmoji = (emojiString: string) => {
    let hash = 0;
    for (let i = 0; i < emojiString.length; i++) {
        hash = emojiString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;
    const pastelR = Math.floor((r % 128) + 127);
    const pastelG = Math.floor((g % 128) + 127);
    const pastelB = Math.floor((b % 128) + 127);
    const a = 0.5;
    return `rgba(${pastelR}, ${pastelG}, ${pastelB}, ${a})`;
};

const EmojIcon: React.FC<IEmojIconProps> = ({ emojis, style }) => {
    const positions = [
        { top: 10, left: 10 },
        { top: 10, left: 50 },
        { top: 50, left: 10 },
        { top: 50, left: 50 },
    ];
    const single = emojis.length === 1;
    return (
        <div
            style={style}
            className={cl("emoj-icon", {
                "flex justify-center items-center": single,
            })}
        >
            {single && (
                <span
                    style={{
                        backgroundColor: generatePastelColorFromEmoji(
                            emojis[0],
                        ),
                    }}
                    className="emoj-icon--emoji--single flex justify-center items-center"
                >
                    {emojis[0]}
                </span>
            )}
            {!single &&
                emojis.map((a, idx) => {
                    return (
                        <span
                            style={{
                                top: `${positions[idx % positions.length].top + (Math.random() * 30 - 15)}%`,
                                left: `${positions[idx % positions.length].left + (Math.random() * 30 - 15)}%`,
                                backgroundColor: generatePastelColorFromEmoji(
                                    emojis[0],
                                ),
                            }}
                            className="emoj-icon--emoji flex justify-center items-center"
                            key={idx}
                        >
                            {a}
                        </span>
                    );
                })}
        </div>
    );
};

export default React.memo(EmojIcon);
