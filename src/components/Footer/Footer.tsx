import React, { useMemo } from "react";
import { CiLock } from "react-icons/ci";
import InlineLink from "../Atoms/InlineLink/InlineLink";
import connectionsData from "../../configs/connections.json";
import linksData from "../../configs/links.json";
import Button from "../Button/Button";

import "./Footer.css";

import GetInTouch from "./GetIntoTouchFooterSection/GetIntoTouchFooterSection";
import LocalTime from "./LocalTime/LocalTime";
import { deepCopyJson } from "../Utility/StringUtility";

const linksToMyOtherSocialMedia = connectionsData.connections;

const Footer: React.FC = () => {
  const getSectionData = (name: string): any => {
    const footerLinkCapacity = 5;
    const result = deepCopyJson(
      linksData.links.filter((item: any) => item.name === name)[0],
    );
    // get only footerLinkCapacity number of sublinks due to lack of space in the footer
    result.sublinks = result.sublinks?.slice(0, footerLinkCapacity);
    return result;
  };

  const about = useMemo(() => getSectionData("About"), []);
  const tools = useMemo(() => getSectionData("Tools"), []);
  const resume = useMemo(() => getSectionData("Resume"), []);

  const renderFooterSection = (
    section: any,
    className: string,
    target?: string,
  ) => {
    return (
      <section className={className}>
        <h3 className="text-lg important-text mb-2">{section.name}</h3>
        {section.sublinks?.map((item: any, index: number) => {
          return (
            <InlineLink
              target={target}
              key={index}
              to={item.isLocked ? null : item.to}
              className="mt-2"
            >
              {item.name} {item.isLocked && <CiLock className="ml-2" />}
            </InlineLink>
          );
        })}
      </section>
    );
  };

  return (
    <footer className="footer relative flex items-center flex-col pt-10">
      <div className="footer__main normalised-width w-full">
        <GetInTouch />
        <section className="footer__connect-with-me">
          <h3 className="text-lg important-text mb-2">Connect with Me</h3>
          <div className="flex flex-col justify-center">
            {linksToMyOtherSocialMedia.map((item: any, index: number) => (
              <InlineLink
                target="_blank"
                key={index}
                to={item.link}
                className="mt-1"
              >
                {item.name}
              </InlineLink>
            ))}
          </div>
        </section>
        <section className="footer__sponsor">
          <h3 className="text-lg important-text mb-2">Sponsor Me</h3>
          <InlineLink
            target="_blank"
            to="https://ko-fi.com/D1D1PFTTH"
            className="mt-1"
          >
            Kofi
          </InlineLink>
          <InlineLink
            target="_blank"
            to="https://melbournewalk24.can4cancer.com.au/lucas-liu"
            className="mt-1"
          >
            Can4cancer
          </InlineLink>
        </section>
        {renderFooterSection(about, "footer__about")}
        <section className="footer__resources">
          <h3 className="text-lg important-text mb-2">Resources</h3>
          <InlineLink to={resume.to} className="mt-1">
            {resume.name}
          </InlineLink>
        </section>
        {renderFooterSection(tools, "footer__tools")}
        <section className="footer__local-time">
          <h3 className="text-lg mb-2 important-text mb-2">Local Time</h3>
          <LocalTime />
        </section>
      </div>
      <div className="footer__bottom relative w-full flex justify-around">
        <p>LLcode.tech © 2024 All Rights Reserved</p>
        <p>Made with Typescript, Rust and Love 💖 v0.5.0</p>
        <Button to="https://github.com/luyangliuable/personal-portfolio-next/issues">
          Submit an Issue
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
