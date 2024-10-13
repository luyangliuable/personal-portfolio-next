import React from "react";
import type { Metadata } from "next";
// @ts-ignore
import "./Chatbot.css";
import LlChatbot from "../../../page/Chatbot/Chatbot";
import ConfigRepository from "../../../repositories/ConfigRepo";

export const metadata: Metadata = {
    title: "Luyang's Chatbot",
    description: "A chatgpt clone.",
};

const page = async () => {
    const configRepo = ConfigRepository.getInstance();
    const baseURI = await configRepo.get("OLLAMA_CLIENT_API");

    return <LlChatbot baseURI={String(baseURI)} />;
};

export default page;
