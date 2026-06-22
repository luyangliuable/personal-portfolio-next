import "./LoadingBar.css";

const LoadingBar = () => {
    return (
        <div
            aria-label="Loading content"
            className="loading-bar"
            role="progressbar"
        >
            <div className="box1">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <div className="box2">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <div className="box3">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <div className="box4">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </div>
    );
};

export default LoadingBar;
