import React from "react";
const h = React.createElement;
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const addToQueue = vi.fn();
const toggleTrigger = vi.fn();

vi.mock("next/link", () => ({
    default: ({ href, children, ...props }: any) => (
        <a href={href} {...props}>{children}</a>
    ),
}));
vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}));
vi.mock("@/components/Button/Button", () => ({
    default: ({ children, onClick, disabled, className, type = "button" }: any) => (
        <button type={type} disabled={disabled} className={className} onClick={onClick}>{children}</button>
    ),
}));
vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, elementType: Tag = "span", className }: any) => <Tag className={className}>{children}</Tag>,
}));
vi.mock("@/components/TagCloud/TagCloud", () => ({ default: ({ tags }: any) => <div>{tags?.join(",")}</div> }));
vi.mock("@/stores/DynamicLoadQueue/DynamicLoadQueue", () => ({ default: { getInstance: () => ({ addToQueue }) } }));
vi.mock("@/stores/TriggerContext", () => ({ useTrigger: () => ({ trigger: 1, toggleTrigger }) }));
vi.mock("@/hooks", () => ({ useScrollPosition: () => ({ scrolling: true }) }));

const timeline = { add: vi.fn().mockReturnThis(), timeScale: vi.fn().mockReturnThis(), pause: vi.fn(), resume: vi.fn(), kill: vi.fn(), fromTo: vi.fn().mockReturnThis() };
vi.mock("gsap", () => ({ gsap: { timeline: vi.fn(() => timeline), fromTo: vi.fn(() => ({})), to: vi.fn(), registerPlugin: vi.fn() } }));
vi.mock("@gsap/react", () => ({ useGSAP: (cb: any) => cb() }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@/components/Organisms/BlackHole/BlackHole", () => ({ default: () => <div>BlackHole</div> }));
vi.mock("@/components/Organisms/ZaBanquet/ZaBanquet", () => ({ default: () => <div>ZaBanquet</div> }));
vi.mock("@/components/Organisms/Burger/Burger", () => ({ default: () => <div>Burger</div> }));
vi.mock("@/components/TwinCandle/TwinCandle", () => ({ default: React.forwardRef((_: any, ref: any) => { React.useImperativeHandle(ref, () => ({ transitionCandleFireToOn: vi.fn(), transitionCandleFireToOff: vi.fn() })); return <div>TwinCandle</div>; }) }));
vi.mock("@/components/LandingPageCard/LandingPageCard", () => ({ default: ({ children, heading }: any) => <section><h2>{heading}</h2>{children}</section> }));
vi.mock("@/components/Retro/Retro", () => ({ default: () => <div>Retro</div> }));
vi.mock("@/components/Atoms/ImageDisplayModal/ImageDisplayModal", () => ({ default: ({ showModal, description, image }: any) => <div data-testid="modal">{showModal ? "open" : "closed"}{description}{image}</div> }));

const octokitList = vi.fn();
vi.mock("@octokit/rest", () => ({ Octokit: vi.fn(() => ({ repos: { listContributors: octokitList } })) }));
vi.mock("p5/lib/p5.js", () => ({ default: vi.fn(function(this: any, sketch: any, node: any) { this.remove = vi.fn(); const p: any = { windowWidth: 100, windowHeight: 100, WEBGL: "WEBGL", TRIANGLE_STRIP: "TRI", PI: Math.PI, createCanvas: vi.fn(), noise: vi.fn(() => 0.5), map: vi.fn((v,a,b,c,d) => c + ((v-a)/(b-a))*(d-c)), background: vi.fn(), translate: vi.fn(), rotateX: vi.fn(), stroke: vi.fn(), strokeWeight: vi.fn(), beginShape: vi.fn(), fill: vi.fn(), vertex: vi.fn(), endShape: vi.fn(), color: vi.fn((...args) => args.join(",")), lerpColor: vi.fn((a) => a) }; sketch(p); p.setup(); p.draw(); }) }));

import SmallCard from "@/components/Atoms/SmallCard/SmallCard";
import BlogYear from "@/components/BlogYear/BlogYear";
import CodingCat from "@/components/CodingCat/CodingCat";
import EmojIcon from "@/components/EmojIcon/EmojIcon";
import ExperienceSection from "@/components/ExperienceSection/ExperienceSection";
import ExperienceSectionEvent from "@/components/ExperienceSection/ExperienceSectionEvent/ExperienceSectionEvent";
import ExperienceSectionImageDisplay from "@/components/ExperienceSection/ExperienceSectionImageDisplay/ExperienceSectionImageDisplay";
import FeaturedContentSection from "@/components/FeaturedContentSection/FeaturedContentSection";
import Footer from "@/components/Footer/Footer";
import GetInTouch from "@/components/Footer/GetIntoTouchFooterSection/GetIntoTouchFooterSection";
import FractalHills from "@/components/FractalHills/FractalHills";
import Gallery from "@/components/Gallery/Gallery";
import Contributors from "@/components/Gallery/GalleryItem/Contributors/Contributors";
import GalleryItem from "@/components/Gallery/GalleryItem/GalleryItem";

beforeEach(() => {
    vi.clearAllMocks();
    (global as any).IntersectionObserver = vi.fn(function(this: any, cb: any) { this.observe = vi.fn(); this.unobserve = vi.fn(); cb([{ isIntersecting: true, target: document.createElement("div") }]); });
});

describe("new coverage target visual components", () => {
    const item: any = { dateTime: "2024", cardTitle: "Title", cardSubtitle: "Role", cardDetailedText: "Details", location: "-37.1, 145.2", objectPosition: "bottom", media: { source: { url: "/img.png" } } };

    it("renders SmallCard and emoji variants", () => {
        render(<SmallCard link="/a" heading="Head" author="Me" authorImage="/me.png" image="/card.png" /> as any);
        expect(screen.getByText("Head")).toBeInTheDocument();
        expect(screen.getByRole("link")).toHaveAttribute("href", "/a");
        render(<EmojIcon emojis={["A"]} style={{ color: "red" }} />);
        render(<EmojIcon emojis={["A", "B", "C", "D", "E"]} />);
        expect(screen.getAllByText("A").length).toBeGreaterThan(1);
    });

    it("renders observer and animation driven components", () => {
        render(<BlogYear year="2024" />);
        expect(screen.getByText("2024").parentElement).toHaveClass("blog__year--animate");
        const { container, unmount } = render(<CodingCat pixelated className="extra" />);
        expect(container.querySelector("svg")).toHaveClass("extra");
        expect(container.querySelector("#coding-cat")).toHaveAttribute("filter", "url(#pixelate)");
        expect(timeline.resume).toHaveBeenCalled();
        unmount();
        expect(timeline.kill).toHaveBeenCalled();
    });

    it("renders experience cards and modal interactions", () => {
        render(<ExperienceSectionEvent timeLineRef={{ current: null }} item={item} index={0} />);
        expect(screen.getByText("Title")).toBeInTheDocument();
        render(<ExperienceSectionImageDisplay item={item} index={1} />);
        expect(screen.getByText("37.1000°S, 145.2000°E")).toBeInTheDocument();
        fireEvent.click(document.querySelector(".expand")!);
        expect(screen.getByTestId("modal")).toHaveTextContent("open");
    });

    it("renders ExperienceSection timeline content", () => {
        render(<ExperienceSection />);
        expect(screen.getByText("Retrospective")).toBeInTheDocument();
        expect(screen.getByText("BlackHole")).toBeInTheDocument();
    });

    it("renders featured content and show more behavior", () => {
        Object.defineProperty(window, "innerWidth", { value: 900, configurable: true });
        render(<FeaturedContentSection postList={[{ _id: { $oid: "p1" }, is_featured: true, heading: "Post", body: "Body", tags: [], post_type: "md", date_created: "2024-01-01" } as any]} />);
        expect(screen.getByText("Featured Content")).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Show More/));
        expect(toggleTrigger).toHaveBeenCalled();
    });

    it("submits get in touch form and renders footer", async () => {
        (global as any).fetch = vi.fn().mockResolvedValue({});
        render(<GetInTouch />);
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@test.com" } });
        fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "hello" } });
        fireEvent.click(screen.getByText("Send me a Message"));
        await waitFor(() => expect(screen.getByText("Message Sent!")).toBeInTheDocument());
        render(<Footer />);
        expect(screen.getByText("Connect with Me")).toBeInTheDocument();
        expect(screen.getByText("Sponsor Me")).toBeInTheDocument();
    });

    it("renders p5 hills, gallery, gallery item, and contributors", async () => {
        octokitList.mockResolvedValue({ data: [{ login: "dev", avatar_url: "/a.png", html_url: "https://x", contributions: 2 }] });
        render(<FractalHills />);
        render(<Gallery heading="Gallery" content={[{ name: "One", image: "1" }, { name: "Two", image: "2" }, { name: "Three", image: "3" }] as any} />);
        expect(screen.getByText("Gallery")).toBeInTheDocument();
        render(<GalleryItem name="GI" type="blog" image="/i.png" link="/g" tags={["t"]} description="long description" minuteRead={3} dateCreated="2024-01-01" repoOwner="o" repoName="r" />);
        expect(await screen.findByText("GI")).toBeInTheDocument();
        expect(screen.getByText("BLOG")).toBeInTheDocument();
        render(<Contributors repoOwner="o" repoName="r" />);
        expect(await screen.findByAltText("dev")).toBeInTheDocument();
    });
});
