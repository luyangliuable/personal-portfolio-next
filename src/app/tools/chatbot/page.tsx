'use client';
import React, { useEffect } from "react";
// @ts-ignore
import { Chatbot as ChatbotComponent } from "ollama-chat-client";
import "./Chatbot.css";

const Chatbot = ChatbotComponent as unknown as React.FC<{ baseURI: string }>;

const LlChatbot: React.FC = ({}) => {
    useEffect(() => {
        document.documentElement.scrollTo(0, 0);
    }, []);

    return (
        <main className="chatbot__wrapper">
            <Chatbot baseURI="https://8dfe-2405-6e00-28ee-a3f6-61ac-94d0-acc-8db9.ngrok-free.app" />
        </main>
    );
};

export default LlChatbot;
