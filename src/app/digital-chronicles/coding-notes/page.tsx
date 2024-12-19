import React from "react";
import type { Metadata } from "next";
import Notes from "../../../page/NotePage/NotePage";
import BlogPostResponse from "../../../repositories/Response/BlogPostResponse";
import NoteRepository from "../../../repositories/NoteRepository";

export const metadata: Metadata = {
    title: "Coding Notes",
    description:
        "My personal coding notes and snippets, organised by language and topic that I wrote during Uni.",
};

export default async function NotesPage() {
    const noteRepository = NoteRepository.getInstance();
    const content: BlogPostResponse[] = await noteRepository.getPostList();
    const { title, description } = metadata;

    return <Notes title={title} description={description} content={content} />;
}
