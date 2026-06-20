import React from "react";
const h = React.createElement;
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { addToQueue } = vi.hoisted(() => ({
    addToQueue: vi.fn(),
}));

vi.mock("next/link", () => ({
    default: ({ href, children, ...props }: any) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));
vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt, className }: any) => (
        <img src={src} alt={alt} className={className} />
    ),
}));
vi.mock("@/components/Button/Button", () => ({
    default: ({
        children,
        onClick,
        disabled,
        className,
        type = "button",
    }: any) => (
        <button
            type={type}
            disabled={disabled}
            className={className}
            onClick={onClick}
        >
            {children}
        </button>
    ),
}));
vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, elementType: Tag = "span", className }: any) => (
        <Tag className={className}>{children}</Tag>
    ),
}));
vi.mock("@/components/TagCloud/TagCloud", () => ({
    default: ({ tags }: any) => <div>{tags?.join(",")}</div>,
}));
vi.mock("@/stores/DynamicLoadQueue/DynamicLoadQueue", () => ({
    default: { getInstance: () => ({ addToQueue }) },
}));
vi.mock("@/stores/TriggerContext", () => ({
    useTrigger: () => ({ trigger: 1, toggleTrigger: vi.fn() }),
}));
vi.mock("@/hooks", () => ({ useScrollPosition: () => ({ scrolling: true }) }));

const timeline = {
    add: vi.fn().mockReturnThis(),
    timeScale: vi.fn().mockReturnThis(),
    pause: vi.fn(),
    resume: vi.fn(),
    kill: vi.fn(),
    fromTo: vi.fn().mockReturnThis(),
};
vi.mock("gsap", () => ({
    gsap: {
        timeline: vi.fn(() => timeline),
        fromTo: vi.fn(() => ({})),
        to: vi.fn(),
        registerPlugin: vi.fn(),
    },
}));
vi.mock("@gsap/react", () => ({ useGSAP: (cb: any) => cb() }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@/components/Organisms/BlackHole/BlackHole", () => ({
    default: () => <div>BlackHole</div>,
}));
vi.mock("@/components/Organisms/ZaBanquet/ZaBanquet", () => ({
    default: () => <div>ZaBanquet</div>,
}));
vi.mock("@/components/Organisms/Burger/Burger", () => ({
    default: () => <div>Burger</div>,
}));
vi.mock("@/components/TwinCandle/TwinCandle", () => ({
    default: React.forwardRef((_: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
            transitionCandleFireToOn: vi.fn(),
            transitionCandleFireToOff: vi.fn(),
        }));
        return <div>TwinCandle</div>;
    }),
}));
vi.mock("@/components/LandingPageCard/LandingPageCard", () => ({
    default: ({ children, heading }: any) => (
        <section>
            <h2>{heading}</h2>
            {children}
        </section>
    ),
}));
vi.mock("@/components/Retro/Retro", () => ({
    default: () => <div>Retro</div>,
}));
vi.mock("@/components/Atoms/ImageDisplayModal/ImageDisplayModal", () => ({
    default: ({ showModal, description, image }: any) => (
        <div data-testid="modal">
            {showModal ? "open" : "closed"}
            {description}
            {image}
        </div>
    ),
}));

import SmallCard from "@/components/Atoms/SmallCard/SmallCard";
import BlogYear from "@/components/BlogYear/BlogYear";
import CodingCat from "@/components/CodingCat/CodingCat";
import EmojIcon from "@/components/EmojIcon/EmojIcon";
import ExperienceSection from "@/components/ExperienceSection/ExperienceSection";
import ExperienceSectionEvent from "@/components/ExperienceSection/ExperienceSectionEvent/ExperienceSectionEvent";
import ExperienceSectionImageDisplay from "@/components/ExperienceSection/ExperienceSectionImageDisplay/ExperienceSectionImageDisplay";
import Footer from "@/components/Footer/Footer";
import GetInTouch from "@/components/Footer/GetIntoTouchFooterSection/GetIntoTouchFooterSection";

import Gallery from "@/components/Gallery/Gallery";
import GalleryItem from "@/components/Gallery/GalleryItem/GalleryItem";

beforeEach(() => {
    vi.clearAllMocks();
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
        this.observe = vi.fn();
        this.unobserve = vi.fn();
        cb([{ isIntersecting: true, target: document.createElement("div") }]);
    });
});

describe("new coverage target visual components", () => {
    const item: any = {
        dateTime: "2024",
        cardTitle: "Title",
        cardSubtitle: "Role",
        cardDetailedText: "Details",
        location: "-37.1, 145.2",
        objectPosition: "bottom",
        media: { source: { url: "/img.png" } },
    };

    it("renders SmallCard fallback URLs and deterministic emoji variants for single and multi-emoji inputs.", () => {
        render(
            (
                <SmallCard
                    link="/a"
                    heading="Head"
                    author="Me"
                    authorImage="/me.png"
                    image="/card.png"
                />
            ) as any,
        );
        render((<SmallCard heading="Fallback" author="Me" />) as any);
        expect(screen.getByText("Head")).toBeInTheDocument();
        expect(screen.getByText("Fallback")).toBeInTheDocument();
        expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "/a");
        render(<EmojIcon emojis={["A"]} style={{ color: "red" }} />);
        render(<EmojIcon emojis={["A", "B", "C", "D", "E"]} />);
        expect(screen.getAllByText("A").length).toBeGreaterThan(1);
    });

    it("marks BlogYear as visible from observer events and runs CodingCat scroll animation lifecycle.", () => {
        render(<BlogYear year="2024" />);
        expect(screen.getByText("2024").parentElement).toHaveClass(
            "blog__year--animate",
        );
        const { container, unmount } = render(
            <CodingCat pixelated className="extra" />,
        );
        expect(container.querySelector("svg")).toHaveClass("extra");
        expect(container.querySelector("#coding-cat")).toHaveAttribute(
            "filter",
            "url(#pixelate)",
        );
        expect(timeline.resume).toHaveBeenCalled();
        unmount();
        expect(timeline.kill).toHaveBeenCalled();
    });

    it("formats experience coordinates and opens the image modal from the expand action.", () => {
        render(
            <ExperienceSectionEvent
                timeLineRef={{ current: null }}
                item={item}
                index={0}
            />,
        );
        expect(screen.getByText("Title")).toBeInTheDocument();
        render(<ExperienceSectionImageDisplay item={item} index={1} />);
        expect(screen.getByText("37.1000°S, 145.2000°E")).toBeInTheDocument();
        fireEvent.click(document.querySelector(".expand")!);
        expect(screen.getByTestId("modal")).toHaveTextContent("open");
    });

    it("builds the retrospective timeline from configured experience entries.", () => {
        render(<ExperienceSection />);
        expect(screen.getByText("Retrospective")).toBeInTheDocument();
        expect(screen.getByText("BlackHole")).toBeInTheDocument();
    });

    it("posts get-in-touch form data and updates the submit button after success.", async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({}) as any;
        render(<GetInTouch />);
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "a@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Message"), {
            target: { value: "hello" },
        });
        fireEvent.click(screen.getByText("Send me a Message"));
        await waitFor(() =>
            expect(screen.getByText("Message Sent!")).toBeInTheDocument(),
        );
        render(<Footer />);
        expect(screen.getByText("Connect with Me")).toBeInTheDocument();
        expect(screen.getByText("Sponsor Me")).toBeInTheDocument();
    });

    it("transforms gallery items and queues rendered gallery cards for dynamic loading.", async () => {
        render(
            <Gallery
                heading="Gallery"
                content={
                    [
                        { name: "One", image: "1" },
                        { name: "Two", image: "2" },
                        { name: "Three", image: "3" },
                    ] as any
                }
            />,
        );
        expect(screen.getByText("Gallery")).toBeInTheDocument();
        render(
            <>
                <GalleryItem
                    name="GI"
                    type="blog"
                    image="/i.png"
                    link="/g"
                    tags={["t"]}
                    description="long description"
                    minuteRead={3}
                    dateCreated="2024-01-01"
                />
                <GalleryItem
                    name="Tool"
                    type="tool"
                    imageOverlay="/overlay.png"
                    metadata={[{ icon: "I", value: "raw" }]}
                />
                <GalleryItem
                    name="Callback"
                    type="none"
                    metadata={[
                        { icon: "I", value: "x", callback: () => "mapped" },
                    ]}
                />
            </>,
        );
        expect(await screen.findByText("GI")).toBeInTheDocument();
        expect(screen.getByText("BLOG")).toBeInTheDocument();
        expect(screen.getByText("TOOL")).toBeInTheDocument();
        expect(await screen.findByText("raw")).toBeInTheDocument();
        expect(screen.getByText("mapped")).toBeInTheDocument();
        expect(addToQueue).toHaveBeenCalled();
    });
});
