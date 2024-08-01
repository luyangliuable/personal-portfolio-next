import React, { useState, FC, ReactNode } from "react";
import "./Accordion.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { cl } from "../Utility/LogicUtility";

interface IAccordionItemProps {
    heading: string;
    icon?: ReactNode;
    children: ReactNode;
}

interface IAccordionProps {
    children: ReactNode;
}

const Item: FC<IAccordionItemProps> = ({ heading, children, icon }) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="accordion--item flex flex-col">
            <div onClick={() => setShow(prev => !prev)} className="accordion--tab noselect flex items-center justify-between cursor-pointer">
                <div className="flex flex-row items-center">
                    <span className="mr-4">{icon}</span>
                    <span>{heading}</span>
                </div>
                <IoIosArrowDropdown className={cl({ "flip": show, "no-flip": !show })} />
            </div>
            <div className={cl("accordion--content w-full flex flex-col items-center", { "none": !show })}>
                {children}
            </div>
        </div>
    );
}

const Accordion: FC<IAccordionProps> & { Item: FC<IAccordionItemProps> } = ({ children }) => {
    return (
        <div className="accordion">
            {children}
        </div>
    );
}

Accordion.Item = Item;

export default Accordion;
