import React from "react";
import "./EmojIcon.css";
import { cl } from "../Utility/LogicUtility";

interface IEmojIconProps {
    emojis: string[]
}

const generateRandomPastelColor = () => {
    const r = Math.floor((Math.random() * 127) + 127);
    const g = Math.floor((Math.random() * 127) + 127);
    const b = Math.floor((Math.random() * 127) + 127);
    const a = 0.5;
    return `rgb(${r}, ${g}, ${b}, ${a})`;
}

const EmojIcon: React.FC<IEmojIconProps> = ({ emojis }) => {
    const positions = [
        { top: 10, left: 10 },
        { top: 10, left: 50 },
        { top: 50, left: 10 },
        { top: 50, left: 50 }
    ]
    const single = emojis.length === 1;
    return (
        <div className={cl("emoj-icon", {"flex justify-center items-center": single})}>
            {single &&
                <span
                    style={{ backgroundColor: generateRandomPastelColor() }}
                    className="emoj-icon--emoji--single flex justify-center items-center">
                    {emojis[0]}
                </span>
            }
            {!single &&
                emojis.map((a, idx) => {
                    return (
                        <span
                            style={{
                                top: `${positions[idx % positions.length].top + (Math.random() * 30 - 15)}%`,
                                left: `${positions[idx % positions.length].left + (Math.random() * 30 - 15)}%`,
                                backgroundColor: generateRandomPastelColor()
                            }}
                            className="emoj-icon--emoji flex justify-center items-center"
                            key={idx}
                        >
                            {a}
                        </span>
                    )
                })
            }
        </div>
    )
}

export default EmojIcon;
