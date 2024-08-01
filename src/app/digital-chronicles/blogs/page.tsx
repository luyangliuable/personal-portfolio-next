import React from "react";
import BlogPage from "../../../page/BlogPage/BlogPage";
import type { Metadata } from "next";
import PostRepository from "../../../repositories/PostRepository";
import BlogPostResponse from "../../../repositories/Response/BlogPostResponse";

export const metadata: Metadata = {
    title: "Luyang's Blog",
    description: ""
};

export default async function BlogPageWithTopPicks() {
    const postRepository = PostRepository.getInstance();
    /* const content: BlogPostResponse[] = await postRepository.getPostList(); */

    return <BlogPage showTopPicks showLoadingSkeleton/>;
}
