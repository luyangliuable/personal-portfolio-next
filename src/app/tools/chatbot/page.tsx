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
            <Chatbot baseURI="https://6dc8-101-115-129-33.ngrok-free.app" />
        </main>
    );
};

export default LlChatbot;
