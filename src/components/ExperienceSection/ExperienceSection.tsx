"use client";

import React, { useCallback, useRef, useState, useEffect, useMemo } from "react";
import IExperienceSectionProps from "./Interface/IExperienceSectionProps";
import {
  IExperienceSectionState,
  ExperienceSectionItem,
} from "./Interface/IExperienceSectionState";
import ExperienceSectionEvent from "./ExperienceSectionEvent/ExperienceSectionEvent";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import ExperienceSectionImageDisplay from "./ExperienceSectionImageDisplay/ExperienceSectionImageDisplay";
import BlackHole from "../Organisms/BlackHole/BlackHole";
import { useScrollPosition } from "../../hooks";

import "./ExperienceSection.css";
import ZaOcean from "../Organisms/ZaOcean/ZaOcean";
import ZaBanquet from "../Organisms/ZaBanquet/ZaBanquet";

const ExperienceSection: React.FC<IExperienceSectionProps> = ({}) => {
  const experienceSectionParentRef = useRef<HTMLDivElement | null>(null);
  const experienceSectionRef = useRef<HTMLElement | null>(null);
  const experienceSectionScrollRef = useRef<HTMLDivElement | null>(null);
  const timeLineRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScrollPosition();

  const items: ExperienceSectionItem[] =
    useMemo((): ExperienceSectionItem[] => {
      return [
        {
          dateTime: "2024",
          cardTitle: "",
          url: "",
          cardSubtitle: "",
          location: "-37.8180679, 145.192779",
          cardDetailedText:
                        "After work, the setting sun casts a warm glow across the platform.",
          importance: 1,
          display: "IMAGE",
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/668c9606a8e1db1f839dba5a",
            },
          },
        }, {
          dateTime: "2022",
          cardTitle: "Monash NRC",
          url: "",
          cardSubtitle: "Orion College Advisor",
          cardDetailedText: "",
          importance: .8,
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/667d0d655f03f0355e1fc36c",
            },
          },
        }, {
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
        }, {
          dateTime: "2023",
          cardTitle: "",
          location: "-24.997805, 172.478887",
          url: "",
          cardSubtitle: "",
          cardDetailedText:
                        "Last sunset captured onboard the princess cruise voyage.",
          importance: 1,
          display: "IMAGE",
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/65920a4af1f0fe657dc4683b",
            },
          },
        }, {
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
        }, {
          dateTime: "2023",
          cardTitle: "Sonorous",
          url: "https://www.linkedin.com/company/sonorus-au/",
          cardSubtitle: "ML Engineer",
          cardDetailedText: "",
          importance: 1,
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/65920366f1f0fe657dc46839",
            },
          },
        }, {
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
        }, {
          dateTime: "2022",
          cardTitle: "",
          url: "",
          cardSubtitle: "",
          location: "-37.902488, 145.164690",
          cardDetailedText:
                        "In the park where I habitually strolled with Teddie post-work or studies, the sunset painted serene silences. ",
          importance: 1,
          display: "IMAGE",
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/65c3629e98a82efb52729772",
            },
          },
        }, {
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
        }, {
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
        }, {
          dateTime: "2022",
          cardTitle: "",
          url: "",
          cardSubtitle: "",
          location: "-37.829423, 145.058246",
          cardDetailedText: "A image I took of the sunset in Camberwell where I used to live.",
          importance: .9,
          display: "IMAGE",
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/667d05f65f03f0355e1fc367"
            }
          }
        }, {
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
        }, {
          dateTime: "2021",
          cardTitle: "",
          url: "",
          cardSubtitle: "",
          location: "Home",
          cardDetailedText: "One peaceful morning I sat quietly, with my dog Teddie resting comfortably on my lap. ",
          importance: 1,
          display: "IMAGE",
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/667d0b605f03f0355e1fc36b"
            }
          }
        }, {
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
        }, {
          dateTime: "2021",
          cardTitle: "",
          url: "",
          cardSubtitle: "",
          location: "-37.790968, 145.172341",
          cardDetailedText: "I captured this serene view at Mad Patties during the COVID era.",
          importance: 1,
          display: "IMAGE",
          media: {
            type: "IMAGE",
            source: {
              url: "https://llcode.tech/api/image/667cfff15f03f0355e1fc35f"
            }
          }
        }, {
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
        }, {
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
      ];
    }, []);

    useEffect(() => {
        const addIntersectionObserver = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      lockPosition();
                    } else {
                      unlockPosition();
                    }
                });
            }, { threshold: .5 });
            if (experienceSectionParentRef.current) observer.observe(experienceSectionParentRef.current);
            return observer;
        }
        const observer = addIntersectionObserver();
        return () => observer.disconnect();
    }, [experienceSectionParentRef.current])

    const [state, setState] = useState<IExperienceSectionState>({ isLocked: false });

    useEffect(() => {
        const updateTimelineLength = (): void => {
            const offset = 10;
            if (experienceSectionParentRef.current === null) return;
            const timeLineLength =
                experienceSectionScrollRef.current!.getBoundingClientRect().width +
                offset;
            const targetElement = experienceSectionParentRef.current?.parentElement;
            if (targetElement) targetElement.style.height = `${timeLineLength}px`;
            setState({
                ...state,
                timeLineLength: timeLineLength,
            });
        };
        updateTimelineLength();
        if (experienceSectionParentRef.current!) setLockPosition();
    }, []);

    useEffect(() => {
        if (state.isLocked && state.lockPosition !== undefined && scrollY) {
            const scrollAmount = state.lockPosition - scrollY;
            scrollTimeline(scrollAmount);
        }
        if (isBeforeLockPosition(0)) unlockPosition();
    }, [scrollY]);

    const lockPosition = (): void => {
        if (scrollY !== undefined) {
            setState({
                ...state,
                isLocked: true,
            });
        }
    };

    const setLockPosition = () => {
        if (experienceSectionParentRef.current === null) return;
        const currentPosition =
            experienceSectionParentRef.current!.parentElement!.getBoundingClientRect()
                .top + (scrollY ?? 0);
        console.log(currentPosition);
        if (!state.isLocked && state.lockPosition !== currentPosition) {
            setState({
                ...state,
                lockPosition: currentPosition,
            });
        }
    };

    const unlockPosition = (): void => {
        if (state.isLocked) {
            setState({
                ...state,
                isLocked: false,
            });
            scrollTimeline(0);
        }
    };

    const scrollTimeline = (scrollXAmount: number): void => {
        if (state.isLocked) {
            const transformValue = `translate(${scrollXAmount}px, 0)`;
            experienceSectionScrollRef.current!.style.transform = transformValue;
        }
    };

    const isBeforeLockPosition = (
        proximityYToLockPosition: number = 0,
    ): boolean => {
        const { lockPosition } = state;
        const isBeforeLockPosition =
            scrollY !== undefined &&
            lockPosition !== undefined &&
            scrollY + proximityYToLockPosition < lockPosition;
        return isBeforeLockPosition;
    };

    const sortedItems = items.sort(
        (a: ExperienceSectionItem, b: ExperienceSectionItem) => {
            return parseInt(b.dateTime) - parseInt(a.dateTime);
        },
    );

    const groupExperienceSectionItems = (events: any): any => {
        return events.reduce((groupedEvents: any, event: any) => {
            const year = new Date(event.dateTime).getFullYear().toString();
            if (!groupedEvents[year]) groupedEvents[year] = [];
            groupedEvents[year].push(event);
            return groupedEvents;
        }, {});
    };

    const mapExperienceSectionItems = useCallback(() => {
        // TODO: https://stackoverflow.com/questions/70169152/how-to-memoize-each-element-in-an-array-map-in-react-with-usememo
        const groupedItems = groupExperienceSectionItems(sortedItems);
        let accumulatedIdx = 0;
        return Object.keys(groupedItems)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((year) => {
                const currentYearItems = groupedItems[year];
                const fragment = (
                    <div className="timeline__year" key={year}>
                        {year === String(2023) && <ZaOcean />}
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
                        <div className="experience-section__year">{year}</div>
                    </div>
                );
                accumulatedIdx += currentYearItems.length;
                return fragment;
            });
    }, []);

    const experienceSectionContent = useMemo(() => (
        <div
            className="timeline__line flex flex-row items-center"
            ref={timeLineRef} >
            {mapExperienceSectionItems()}
            <BlackHole />
        </div>
    ), [mapExperienceSectionItems]);

    return (
        <div className="experience-section-wrapper">
            <article
                className="landing-page-card flex flex-col justify-start overflow-hidden experience-section-parent-container"
                ref={experienceSectionParentRef}>
                <header className="ml-2vw important-text">
                    <SequentialRiseSpan elementType="h2">Retrospective</SequentialRiseSpan>
                </header>
                <section ref={experienceSectionRef} className="experience-section">
                    {/* Scrolling timeline within the section */}
                    <div
                        ref={experienceSectionScrollRef}
                        className="experience-section--content">
                        {experienceSectionContent}
                    </div>
                </section>
            </article>
        </div>
    );
};

export default ExperienceSection;
