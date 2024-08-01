import React, { useState } from "react";
import "./Accordion.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { cl } from "../Utility/LogicUtility";

interface IAccordionItemProps {
    heading: string,
    children: React.ReactNode
}

const Item: React.FC<IAccordionItemProps> = ({ heading, children }) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="accordion--item flex flex-col">
            <div onClick={() => setShow(prev => !prev)} className="accordion--tab noselect flex items-center justify-between cursor-pointer">
                <span>{heading}</span>
                <IoIosArrowDropdown className={cl({ "flip": show, "no-flip": !show })} />
            </div>
            <div className={cl("accordion--content w-full flex flex-col items-center", { "none": !show })}>
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
