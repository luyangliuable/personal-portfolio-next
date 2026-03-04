"use client";

import { useRef, useState, type RefObject } from "react";
import Button from "../../Button/Button";
import "./GetIntoTouchFooterSection.css";

const GetInTouch: React.FC = () => {
    const [buttonClassName, setButtonClassName] = useState("");
    const [buttonChildren, setButtonChildren] = useState("Send me a Message");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const messageEmailRef: RefObject<HTMLInputElement> = useRef(null);
    const messageDescriptionRef: RefObject<HTMLTextAreaElement> = useRef(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = messageEmailRef.current?.value;
        const description = messageDescriptionRef.current?.value;
        if (!name || !description) return;
        const messageDetails = { name, description };
        const BASE_URL: string =
            process.env.REACT_APP_WEATHER_API_BASE_URL ||
            "https://llcode.tech/api";
        fetch(`${BASE_URL}/message`, {
            method: "POST",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messageDetails),
        })
            .then((_) => {
                setButtonClassName("button__done");
                setButtonChildren("Message Sent!");
                setButtonDisabled(true);
            })
            .catch((_) => {
                setButtonClassName("button__error");
                setButtonChildren("Error Sending Message");
                setButtonDisabled(true);
            });
    };

    return (
        <form
            className="footer__get-in-touch flex flex-col items-start justify-start"
            onSubmit={handleSubmit}
        >
            <h3 className="text-lg mb-4 important-text">Get In Touch</h3>
            <input
                ref={messageEmailRef}
                className="box-border"
                type="text"
                placeholder="Email"
            />
            <textarea
                ref={messageDescriptionRef}
                className="box-border"
                placeholder="Message"
            />
            <Button
                type="submit"
                className={buttonClassName}
                onClick={handleSubmit}
                disabled={buttonDisabled}
            >
                {buttonChildren}
            </Button>
        </form>
    );
};

export default GetInTouch;
