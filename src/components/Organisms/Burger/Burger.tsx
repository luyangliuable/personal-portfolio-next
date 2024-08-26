import React from "react";
import "./Burger.css"

const Burger = () => {
    return (
        <div className="burger__wrapper">
            <div className="burger">
                <div className="crown">
                    <div className="sesame"></div>
                    <div className="sesame"></div>
                    <div className="sesame"></div>
                    <div className="sesame"></div>
                    <div className="sesame"></div>
                    <div className="sesame"></div>
                    <div className="sesame"></div>
                    <div className="sesame"></div>
                </div>
                <div className="tomato"></div>
                <div className="patty">
                    <div className="cheese"></div>
                </div>
                <div className="lettuce">
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                    <div className="lettuce__circle"></div>
                </div>
                <div className="heel"></div>
            </div>
        </div>
    );
}

export default Burger;
