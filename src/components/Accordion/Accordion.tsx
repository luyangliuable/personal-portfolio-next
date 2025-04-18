import React, { useState, useMemo, FC, ReactNode } from "react";
import "./Accordion.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { cl } from "../Utility/LogicUtility";
import { CiLock } from "react-icons/ci";

interface IAccordionItemProps {
  heading: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

interface IAccordionButtonProps {
  heading: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  target?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

interface IAccordionProps {
  children: ReactNode;
  className?: string;
}

const Item: FC<IAccordionItemProps> = ({
  heading,
  children,
  icon,
  className,
}) => {
  const [show, setShow] = useState<boolean>(false);

  const memoizedDropdown = useMemo(
    () => (
      <IoIosArrowDropdown
        className={cl("accordion__dropdown-button", {
          flip: show,
          "no-flip": !show,
        })}
      />
    ),
    [show],
  );

  return (
    <div className="accordion--item flex flex-col">
      <div
        onClick={(e) => {
          setShow((prev) => !prev);
          if (!show)
            (e.target as HTMLElement).scrollIntoView({
              behavior: "smooth",
            });
        }}
        className={cl(
          "accordion--tab noselect flex items-center justify-between cursor-pointer",
          className,
        )}
      >
        <div className="flex flex-row items-center">
          <span className="mr-2">{icon}</span>
          <span>{heading}</span>
        </div>
        {memoizedDropdown}
      </div>
      <div
        className={cl(
          "accordion--content w-full flex flex-col items-center justify-center",
          { hidden: !show },
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Button: FC<IAccordionButtonProps> = ({
  heading,
  icon,
  href,
  onClick,
  className,
  target,
  disabled,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const isLink = href && !disabled;
  return (
    <div className="accordion--item flex flex-row justify-between">
      {React.createElement(
        isLink ? "a" : "div",
        {
          className: cl(
            "accordion--button noselect flex items-center justify-between cursor-pointer",
            className,
          ),
          href: isLink ? href : undefined,
          target: isLink ? target : undefined,
          onClick: onClick,
        },
        <div className={cl("flex flex-row items-center w-full relative")}>
          <span className="mr-2">{icon}</span>
          <span>{heading}</span>
          {disabled && (
            <div
              className="blur-boundary flex justify-center items-center absolute"
              style={{
                background: "rgba(255,255,255,.5)",
                strokeWidth: "2rem",
                right: 0,
                minWidth: "30px",
                minHeight: "30px",
                height: "30px",
                borderRadius: "4px",
                border: ".1px solid #888",
              }}
            >
              <CiLock style={{ strokeWidth: "1px" }} key="lock-icon" />
            </div>
          )}
        </div>,
      )}
    </div>
  );
};

const Accordion: FC<IAccordionProps> & { Item: FC<IAccordionItemProps> } & {
  Button: FC<IAccordionButtonProps>;
} = ({ children, className }) => {
  return (
    <div className={cl("accordion flex flex-col items-center", className)}>
      {children}
    </div>
  );
};

Accordion.Item = Item;
Accordion.Button = Button;

export default Accordion;
