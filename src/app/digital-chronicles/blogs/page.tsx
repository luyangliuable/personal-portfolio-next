import React from "react";
import BlogPage from "../../../page/BlogPage/BlogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Luyang's Blog",
    description: ""
};

export default async function BlogPageWithTopPicks() {
    return <BlogPage showTopPicks showLoadingSkeleton/>;
}
