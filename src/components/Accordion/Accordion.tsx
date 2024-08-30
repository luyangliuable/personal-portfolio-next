import React, { useState, FC, ReactNode } from "react";
import "./Accordion.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { cl } from "../Utility/LogicUtility";
import Link from "next/link";

interface IAccordionItemProps {
  heading: string;
  icon?: ReactNode;
  children: ReactNode;
}

interface IAccordionButtonProps {
  heading: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

interface IAccordionProps {
  children: ReactNode;
}

const Item: FC<IAccordionItemProps> = ({ heading, children, icon }) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="accordion--item flex flex-col">
      <div onClick={(e) => {
        setShow(prev => !prev);
        if (!show) (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
      }} className="accordion--tab noselect flex items-center justify-between cursor-pointer">
        <div className="flex flex-row items-center">
          <span className="mr-2">{icon}</span>
          <span>{heading}</span>
        </div>
        <IoIosArrowDropdown className={cl("accordion__dropdown-button", { "flip": show, "no-flip": !show })} />
      </div>
      <div className={cl("accordion--content w-full flex flex-col items-center", { "none": !show })}>
        {children}
      </div>
    </div >
  );
}

const Button: FC<IAccordionButtonProps> = ({ heading, icon, href, onClick, target }) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="accordion--item flex flex-col">

      {
        React.createElement(
          href ? "a" : "div",
          {
            className: "accordion--button noselect flex items-center justify-between cursor-pointer",
            href: href ? href : undefined,
          },
          <div className="flex flex-row items-center"><span className="mr-2">{icon}</span><span>{heading}</span></div>
        )
      }

      <div className="">
      </div>

    </div >
  );
}

const Accordion: FC<IAccordionProps>
  & { Item: FC<IAccordionItemProps> }
  & { Button: FC<IAccordionButtonProps> }
  = ({ children }) => {
    return (
      <div className="accordion flex flex-col items-center">
        {children}
      </div>
    );
  }

Accordion.Item = Item;
Accordion.Button = Button;

export default Accordion;
