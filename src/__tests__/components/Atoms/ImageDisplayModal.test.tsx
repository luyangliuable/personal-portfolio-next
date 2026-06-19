import React from "react";
const h = React.createElement;
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ImageDisplayModal from "@/components/Atoms/ImageDisplayModal/ImageDisplayModal";

vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

describe("ImageDisplayModal", () => {
    it("strips query parameters from the displayed image URL before rendering the modal.", () => {
        render(<ImageDisplayModal image="https://site.test/a.png?token=1" description="Caption" showModal setShowModal={vi.fn()} />);
        expect(document.querySelector("img")).toHaveAttribute("src", "https://site.test/a.png");
        expect(screen.getByText("Caption")).toBeInTheDocument();
    });

    it("requests closing only when the backdrop is clicked.", () => {
        const setShowModal = vi.fn();
        render(<ImageDisplayModal image="https://site.test/a.png" description="Caption" showModal setShowModal={setShowModal} />);
        fireEvent.click(screen.getByText("Caption"));
        expect(setShowModal).not.toHaveBeenCalled();
        fireEvent.click(document.querySelector(".image-display-modal--container"));
        expect(setShowModal).toHaveBeenCalledWith(false);
    });
});
