"use client";

import React, {
    useCallback,
    useRef,
    useState,
    useEffect,
    useMemo,
    memo,
} from "react";
import IExperienceSectionProps from "./Interface/IExperienceSectionProps";
import {
    IExperienceSectionState,
    ExperienceSectionItem,
} from "./Interface/IExperienceSectionState";
import ExperienceSectionEvent from "./ExperienceSectionEvent/ExperienceSectionEvent";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import ExperienceSectionImageDisplay from "./ExperienceSectionImageDisplay/ExperienceSectionImageDisplay";
import BlackHole from "../Organisms/BlackHole/BlackHole";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiArrowLeftThick } from "react-icons/ti";

import "./ExperienceSection.css";
import ZaBanquet from "../Organisms/ZaBanquet/ZaBanquet";
import { useTrigger } from "../../stores/TriggerContext";
import Burger from "../Organisms/Burger/Burger";

const items: ExperienceSectionItem[] = [
    {
        dateTime: "2022",
        cardTitle: "Monash NRC",
        url: "",
        cardSubtitle: "Orion College Advisor",
        cardDetailedText: "",
        importance: 0.8,
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/6725894618eb5f86ea13b53f",
            },
        },
    },
    {
        dateTime: "2024",
        cardTitle: "Monash University",
        url: "",
        cardSubtitle: "Graduation Ceremony",
        cardDetailedText: "",
        importance: 1,
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/667d085d5f03f0355e1fc369",
            },
        },
    },
    {
        dateTime: "2023",
        cardTitle: "",
        location: "-24.997805, 172.478887",
        url: "",
        cardSubtitle: "",
        cardDetailedText:
            "Last sunset captured onboard the princess cruise voyage.",
        importance: 1,
        objectPosition: "bottom",
        display: "IMAGE",
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/65920a4af1f0fe657dc4683b",
            },
        },
    },
    {
        dateTime: "2024",
        cardTitle: "Commbank",
        url: "https://www.linkedin.com/company/sonorus-au/",
        cardSubtitle: "Software Engineer",
        cardDetailedText: "",
        importance: 1,
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/668c946aa8e1db1f839dba56",
            },
        },
    },
    {
        dateTime: "2023",
        cardTitle: "Sonorous",
        url: "https://www.linkedin.com/company/sonorus-au/",
        cardSubtitle: "ML Engineer",
        cardDetailedText: "",
        importance: 1,
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/6725884d18eb5f86ea13b53e",
            },
        },
    },
    {
        dateTime: "2023",
        cardTitle: "",
        location: "-37.830474, 145.058351",
        url: "",
        cardSubtitle: "",
        cardDetailedText:
            "A sunset silhouettes a distant cityscape in Camberwell.",
        importance: 1,
        display: "IMAGE",
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/65920b85f1f0fe657dc4683c",
            },
        },
    },
    {
        dateTime: "2022",
        cardTitle: "",
        url: "",
        cardSubtitle: "",
        location: "-37.902488, 145.164690",
        objectPosition: "bottom",
        cardDetailedText:
            "In the park where I habitually strolled with Teddie post-work or studies, the afterglow painted serene silences. ",
        importance: 1,
        display: "IMAGE",
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/65c3629e98a82efb52729772",
            },
        },
    },
    {
        dateTime: "2018",
        cardTitle: "MW Sheetmetal",
        url: "http://www.cisco.com",
        cardSubtitle: "Computer Aided Design Technician",
        cardDetailedText: "",
        importance: 0.7,
        media: {
            type: "IMAGE",
            source: {
                url: "https://metro.co.uk/wp-content/uploads/2016/02/poo_emoji.jpg?quality=90&strip=all&zoom=1&resize=644%2C429",
            },
        },
    },
    {
        dateTime: "2021",
        cardTitle: "Monash University Humanwise",
        url: "https://www.mymi.org.au/",
        cardSubtitle: "Summer Research Assistant",
        cardDetailedText: "",
        importance: 0.85,
        media: {
            type: "IMAGE",
            source: {
                url: "https://amsi.org.au/wp-content/uploads/2014/05/logo-monash.png",
            },
        },
    },
    {
        dateTime: "2022",
        cardTitle: "",
        url: "",
        cardSubtitle: "",
        location: "-37.829423, 145.058246",
        cardDetailedText: "",
        objectPosition: "bottom",
        importance: 0.9,
        display: "IMAGE",
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/667d05f65f03f0355e1fc367",
            },
        },
    },
    {
        dateTime: "2022",
        cardTitle: "MYMI",
        url: "https://www.mymi.org.au/",
        cardSubtitle: "Software Engineer",
        cardDetailedText: "",
        importance: 0.85,
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/667d043b5f03f0355e1fc366",
            },
        },
    },
    {
        dateTime: "2021",
        cardTitle: "",
        url: "",
        cardSubtitle: "",
        location: "Home",
        cardDetailedText:
            "One peaceful morning I sat quietly, with my dog Teddie resting comfortably on my lap. ",
        importance: 1,
        display: "IMAGE",
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/667d0b605f03f0355e1fc36b",
            },
        },
    },
    {
        dateTime: "2023",
        cardTitle: "WEX",
        url: "http://www.wex.com",
        cardSubtitle: "Software Developer",
        cardDetailedText: "",
        importance: 1,
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/667d0e585f03f0355e1fc36f",
            },
        },
    },
    {
        dateTime: "2021",
        cardTitle: "",
        url: "",
        cardSubtitle: "",
        location: "-37.790968, 145.172341",
        cardDetailedText: "Mad Patties during the COVID.",
        objectPosition: "top",
        importance: 1,
        display: "IMAGE",
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/667cfff15f03f0355e1fc35f",
            },
        },
    },
    {
        dateTime: "2021",
        cardTitle: "Cisco",
        url: "http://www.cisco.com",
        cardSubtitle: "Network Engineer Intern",
        cardDetailedText: "",
        importance: 0.7,
        media: {
            type: "IMAGE",
            source: {
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/440px-Cisco_logo_blue_2016.svg.png",
            },
        },
    },
    {
        dateTime: "2021",
        cardTitle: "Mad Patties",
        url: "http://www.cisco.com",
        cardSubtitle: "Kitchen Hand",
        cardDetailedText: "",
        media: {
            type: "IMAGE",
            source: {
                url: "https://llcode.tech/api/image/667d02115f03f0355e1fc363",
            },
        },
    },
];

const ExperienceSection: React.FC<IExperienceSectionProps> = ({}) => {
    const experienceSectionParentRef = useRef<HTMLDivElement | null>(null);
    const experienceSectionRef = useRef<HTMLDivElement | null>(null);
    const experienceSectionScrollRef = useRef<HTMLDivElement | null>(null);
    const timeLineRef = useRef<HTMLDivElement | null>(null);

    const [state, setState] = useState<IExperienceSectionState>({});

    useEffect(() => {
        const updateTimelineLength = (): void => {
            const offset = 10;
            if (experienceSectionParentRef.current === null) return;
            const timeLineLength =
                experienceSectionScrollRef.current!.getBoundingClientRect()
                    .width + offset;
            const targetElement =
                experienceSectionParentRef.current?.parentElement;
            if (targetElement)
                targetElement.style.height = `${timeLineLength / 2}px`;
            setState({
                ...state,
                timeLineLength: timeLineLength,
            });
        };

        updateTimelineLength();
    }, []);

    const { trigger } = useTrigger();

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
        if (
            experienceSectionScrollRef.current &&
            experienceSectionParentRef.current &&
            experienceSectionParentRef.current
        ) {
            const scrollElement = experienceSectionScrollRef.current;
            const sectionElement = experienceSectionParentRef.current;
            const triggerElement = sectionElement.parentElement;

            const timelineFinishTrigger = {
                trigger: triggerElement,
                start: `bottom-=${window.innerHeight} top`,
                end: "bottom top",
                scrub: 0.1,
                invalidateOnRefresh: true,
            };

            const timelineStartTrigger = {
                trigger: triggerElement,
                start: `top-=${window.innerHeight} top`,
                end: "top+=100 top",
                scrub: true,
                invalidateOnRefresh: true,
            };

            gsap.timeline()
                .fromTo(
                    triggerElement,
                    { scale: 0.8, y: 10 },
                    {
                        scale: 1,
                        y: 0,
                        scrollTrigger: timelineStartTrigger,
                    },
                )
                .fromTo(
                    triggerElement,
                    {
                        y: 0,
                        scale: 1,
                    },
                    {
                        y: -200,
                        scale: 0.9,
                        ease: "power2.in",
                        scrollTrigger: timelineFinishTrigger,
                    },
                );

            gsap.to(scrollElement, {
                x: () => -scrollElement.scrollWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionElement,
                    start: "top 20%",
                    end: () => `+=${scrollElement.scrollWidth / 2}`,
                    scrub: true,
                },
            });
        }
    }, [trigger]);

    const sortedItems = items.sort(
        (a: ExperienceSectionItem, b: ExperienceSectionItem) => {
            return parseInt(b.dateTime) - parseInt(a.dateTime);
        },
    );

    const groupedItems = useMemo(() => {
        return sortedItems.reduce((groups: any, item: any) => {
            const year = new Date(item.dateTime).getFullYear().toString();
            if (!groups[year]) groups[year] = [];
            groups[year].push(item);
            return groups;
        }, {});
    }, [sortedItems]);

    const mapExperienceSectionItems = useCallback(() => {
        let accumulatedIdx = 0;
        return Object.keys(groupedItems)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((year) => {
                const currentYearItems = groupedItems[year];
                const fragment = (
                    <div className="timeline__year" key={year}>
                        {year === String(2022) && <ZaBanquet />}
                        {currentYearItems.map((item: any, idx: number) => {
                            const currentIndex = accumulatedIdx + idx;
                            if (item.display !== undefined) {
                                return (
                                    <ExperienceSectionImageDisplay
                                        key={currentIndex}
                                        item={item}
                                        index={currentIndex}
                                    />
                                );
                            }
                            return (
                                <ExperienceSectionEvent
                                    timeLineRef={timeLineRef}
                                    key={currentIndex}
                                    item={item}
                                    index={currentIndex}
                                />
                            );
                        })}
                        {year === String(2021) && <Burger />}
                        <div className="experience-section__year flex items-center">
                            <TiArrowLeftThick />
                            {year}
                        </div>
                    </div>
                );
                accumulatedIdx += currentYearItems.length;
                return fragment;
            });
    }, []);

    const experienceSectionContent = useMemo(
        () => (
            <div
                className="timeline__line flex flex-row items-center"
                ref={timeLineRef}
            >
                {mapExperienceSectionItems()}
                <div>
                    <BlackHole />
                </div>
            </div>
        ),
        [mapExperienceSectionItems],
    );

    return (
        <div className="experience-section-wrapper">
            <div
                className="
                    landing-page-card
                    grainy-background
                    flex
                    flex-col
                    justify-end
                    overflow-hidden
                    experience-section-parent-container
                "
                ref={experienceSectionParentRef}
            >
                <header className="ml-[2vw]">
                    <SequentialRiseSpan
                        elementType="h2"
                        className="text-2xl font-bold important-text"
                    >
                        Retrospective
                    </SequentialRiseSpan>
                </header>
                <div
                    ref={experienceSectionRef}
                    className="experience-section flex items-center grow w-100"
                >
                    {/* Scrolling timeline within the section */}
                    <div
                        ref={experienceSectionScrollRef}
                        className="experience-section--content"
                    >
                        {experienceSectionContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ExperienceSection);
