import { useMemo } from "react";
import InlineLink from "../Atoms/InlineLink/InlineLink";
import connectionsData from "../../configs/connections.json";
import linksData from "../../configs/links.json";

import "./Footer.css";

import { deepCopyJson } from "../Utility/StringUtility";

const linksToMyOtherSocialMedia = connectionsData.connections;

const Footer: React.FC = () => {
    const getSectionData = (name: string): any => {
        const footerLinkCapacity = 4;
        const result = deepCopyJson(
            linksData.links.find((item: any) => item.name === name),
        );
        // get only footerLinkCapacity number of sublinks due to lack of space in the footer
        result.sublinks = result.sublinks?.slice(0, footerLinkCapacity);
        return result;
    };

    const work = useMemo(() => getSectionData("Work"), []);
    const writing = useMemo(() => getSectionData("Writing"), []);
    const about = useMemo(() => getSectionData("About"), []);

    const renderFooterSection = (
        section: any,
        className: string,
        target?: string,
    ) => {
        if (!section?.sublinks?.length) return null;
        return (
            <section className={className}>
                <h3 className="text-base font-semibold mb-3">{section.name}</h3>
                {section.sublinks?.map((item: any) => {
                    if (item.isLocked || item.isDisabled) return null;
                    return (
                        <InlineLink
                            target={target}
                            key={item.name}
                            to={item.to}
                            className="mt-2 text-sm opacity-80 hover:opacity-100"
                        >
                            {item.name}
                        </InlineLink>
                    );
                })}
            </section>
        );
    };

    return (
        <footer className="footer relative flex items-center flex-col pt-12">
            <div className="footer__main normalised-width w-full">
                {/* Connect Section - Social links + email */}
                <section className="footer__connect">
                    <h3 className="text-base font-semibold mb-3">Connect</h3>
                    <div className="flex flex-col">
                        {linksToMyOtherSocialMedia.slice(0, 4).map(
                            (item: any) => (
                                <InlineLink
                                    target="_blank"
                                    key={item.name}
                                    to={item.link}
                                    className="mt-2 text-sm opacity-80 hover:opacity-100"
                                >
                                    {item.name}
                                </InlineLink>
                            ),
                        )}
                        <InlineLink
                            to="mailto:luyang.l@protonmail.me"
                            className="mt-2 text-sm opacity-80 hover:opacity-100"
                        >
                            Email Me
                        </InlineLink>
                    </div>
                </section>

                {/* Explore Section - Work, Writing, About */}
                {renderFooterSection(work, "footer__work")}
                {renderFooterSection(writing, "footer__writing")}
                {renderFooterSection(about, "footer__about")}
            </div>

            <div className="footer__bottom relative w-full flex justify-between items-center px-8 lg:px-16">
                <p className="text-sm opacity-60">
                    LLcode.tech © 2024 All Rights Reserved
                </p>
                <div className="flex gap-6 text-sm opacity-60">
                    <InlineLink to="https://github.com/luyangliuable/personal-portfolio-next/issues">
                        Submit an Issue
                    </InlineLink>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
