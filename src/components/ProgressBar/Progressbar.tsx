import type { CSSProperties } from "react";
import "./Progressbar.css";

interface IProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<IProgressBarProps> = ({ progress }) => {
    return (
        <div
            className="progress-bar"
            style={{ "--scale-x": progress } as CSSProperties}
        >
            <div className="progress-bar-inner"></div>
        </div>
    );
};

export default ProgressBar;
