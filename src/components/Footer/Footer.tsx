import React, { useMemo } from "react";
import "./Footer.css";
import { CiLock } from "react-icons/ci";
import InlineLink from "../Atoms/InlineLink/InlineLink";
import connectionsData from "../../configs/connections.json";
import linksData from "../../configs/links.json";
import IconButton from "../Atoms/IconButton/IconButton";
import dynamic from 'next/dynamic';
import Button from "../Button/Button";

// Dynamic import for GetInTouch client component
/* const GetInTouch = dynamic(() => import('./GetInTouch'), { ssr: false }); */
import GetInTouch from "./GetIntoTouchFooterSection/GetIntoTouchFooterSection";

const Footer: React.FC = () => {
    const linksToMyOtherSocialMedia = connectionsData.connections;

    const deepCopyJson = (jsonObject: any) => {
        return JSON.parse(JSON.stringify(jsonObject));
    }

    const getSectionData = (name: string): any => {
        const footerLinkCapacity = 5;
        const result = deepCopyJson(linksData.links.filter((item: any) => item.name === name)[0]);
        // get only footerLinkCapacity number of sublinks due to lack of space in the footer
        result.sublinks = result.sublinks?.slice(0, footerLinkCapacity);
        return result;
    }

    const about = useMemo(() => getSectionData("About"), []);
    const tools = useMemo(() => getSectionData("Tools"), []);
    const resume = useMemo(() => getSectionData("Resume"), []);

    const renderFooterSection = (section: any, className: string, target?: string) => {
        return (
            <section className={className}>
                <h3 className="mb-0">{section.name}</h3>
                {
                    section.sublinks?.map(
                        (item: any, index: number) => {
                            return (
                                <InlineLink target={target} key={index} to={item.isLocked ? null : item.to} className="mt-5">
                                    {item.name} {item.isLocked && <CiLock className="ml-2" />}
                                </InlineLink>
                            )
                        }
                    )
                }
            </section>
        )
    }

    return (
        <footer className="footer flex flex-col">
            <div className="footer__main flex flex-row justify-evenly w-full">
                <GetInTouch />
                <div className="flex flex-col">
                    <section className="footer__connect-with-me mb-20">
                        <h3 className="mb-0">Connect with Me</h3>
                        <div className="flex flex-row flex-wrap">
                            {
                                linksToMyOtherSocialMedia.map(
                                    (item: any, index: number) => (
                                        <IconButton target="_blank" key={index} to={item.link} className="mt-5" logoName={item.name} buttonColor="%23eaeaea"></IconButton>
                                    )
                                )
                            }
                        </div>
                    </section>

                    <section className="footer__sponsor mb-20">
                        <h3 className="mb-0">Sponsor Me</h3>
                        <InlineLink target="_blank" to="https://ko-fi.com/D1D1PFTTH" className="mt-5">Kofi</InlineLink>
                        <InlineLink target="_blank" to="https://melbournewalk24.can4cancer.com.au/lucas-liu" className="mt-5">Can4cancer</InlineLink>
                    </section>
                </div>

                <div className="flex flex-col">
                    {renderFooterSection(about, "footer__about")}
                    <section className="footer__resources">
                        <h3 className="mb-0">Resources</h3>
                        <InlineLink to={resume.to} className="mt-5">{resume.name}</InlineLink>
                    </section>
                </div>

                {renderFooterSection(tools, "footer__tools")}
            </div>
            <div className="footer__bottom position-relative w-full flex justify-around">
                <p>LLcode.tech © 2024 All Rights Reserved</p>
                <p>Made with Typescript, Rust and Love 💖 v0.5.0</p>
                <Button to="https://github.com/luyangliuable/personal-portfolio-next/issues">Submit an Issue</Button>
            </div>
        </footer>
    );
}

export default Footer;
