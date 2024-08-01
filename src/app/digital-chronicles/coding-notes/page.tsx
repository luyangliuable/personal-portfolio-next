import React from "react";
import type { Metadata } from "next";
import Notes from "../../../page/NotePage/NotePage";
import BlogPostResponse from "../../../repositories/Response/BlogPostResponse";
import NoteRepository from "../../../repositories/NoteRepository";

export const metadata: Metadata = {
    title: "Luyang's Coding Notes",
    description: "My personal coding notes and snippets, organized by language and topic that I wrote during the nostalgic days at University."
};


export default async function NotesPage() {
    const noteRepository = NoteRepository.getInstance();
    const content: BlogPostResponse[] = await noteRepository.getPostList();

    return <Notes content={content} />;
}
