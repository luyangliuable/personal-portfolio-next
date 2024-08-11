import React from "react";
import BlogPage from "../../../page/BlogPage/BlogPage";
import type { Metadata } from "next";
import PostRepository from "../../../repositories/PostRepository";

export const metadata: Metadata = {
    title: "Luyang's Blog",
    description: "Blog posts for documenting useful code, mark memorable moments in my life and help my journey of endless self-improvement."
};

export default async function BlogPageWithTopPicks() {
    const postRepo = PostRepository.getInstance();
    const data = await postRepo.getPostList();

    return <BlogPage data={data} showTopPicks showLoadingSkeleton />;
}
