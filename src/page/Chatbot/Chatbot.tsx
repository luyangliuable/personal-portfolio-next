"use client";
import React, { useEffect } from "react";
// @ts-ignore
import { Chatbot as ChatbotComponent } from "ollama-chat-client";
import "./Chatbot.css";
import ConfigRepository from "../../repositories/ConfigRepo";

const Chatbot = ChatbotComponent as unknown as React.FC<{ baseURI: String }>;

interface ILlChatbotProps {
    baseURI: String;
}

const LlChatbot: React.FC<ILlChatbotProps> = ({ baseURI }) => {
    useEffect(() => {
        document.documentElement.scrollTo(0, 0);
        console.log(baseURI);
        console.log(baseURI);
    }, []);

    return (
        <main className="chatbot__wrapper">
            <Chatbot baseURI={baseURI} />
        </main>
    );
};

export default LlChatbot;
