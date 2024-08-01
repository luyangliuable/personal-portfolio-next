import React from "react";
import type { Metadata } from "next";
import Notes from "../../../page/NotePage/NotePage";

export const metadata: Metadata = {
    title: "Luyang's Coding Notes",
    description: "My personal coding notes and snippets, organized by language and topic that I wrote during the nostalgic days at University."
};

const NotesPage: React.FC = () => { return (<Notes />) }

export default NotesPage;
