"use client";

import React, { useRef, useState, RefObject } from "react";
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
        const messageDetails = {
            "name": messageEmailRef.current!.value,
            "description": messageDescriptionRef.current!.value
        };
        const BASE_URL: string = process.env.REACT_APP_WEATHER_API_BASE_URL || "https://llcode.tech/api";
        fetch(`${BASE_URL}/message`, {
            method: "POST",
            cache: "no-cache",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageDetails)
        }).then(_ => {
            setButtonClassName("button__done");
            setButtonChildren("Message Sent!");
            setButtonDisabled(true);
        }).catch(_ => {
            setButtonClassName("button__error");
            setButtonChildren("Error Sending Message");
            setButtonDisabled(true);
        });
    }

    return (
        <form className="footer__get-in-touch flex flex-col items-start justify-start" onSubmit={handleSubmit}>
            <h3>Get In Touch</h3>
            <input ref={messageEmailRef} className="box-border" type="text" placeholder="Email" />
            <textarea ref={messageDescriptionRef} className="box-border" placeholder="Message" />
            <Button
                type="submit"
                className={buttonClassName}
                onClick={handleSubmit}
                disabled={buttonDisabled}
            >{buttonChildren}</Button>
        </form>
    );
}

export default GetInTouch;
