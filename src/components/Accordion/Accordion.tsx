import React from "react";
import "./Accordion.css";

interface IAccordionItemProps {
 heading: string,
    children: React.ReactNode
}

const Item: React.FC<IAccordionItemProps> = ({ heading, children }) => {
    return (
        <div className="accordion--item flex flex-col">
            <div className="accordion--tab flex items-center cursor-pointer">{heading}</div>
            <div className="accordion--content">
                {children}
            </div>
        </div>
    )
}


export const Accordion = ({ children }) => {
    return (
        <div className="accordion">
            {children}
        </div>
    )
}

Accordion.Item = Item;
