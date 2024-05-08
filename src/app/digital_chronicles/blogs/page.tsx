import React from "react";
import type { Metadata } from "next";
import BlogPage from "../../../pages/BlogPage/BlogPage";

export const metadata: Metadata = {
    title: "Luyang's Blog",
    description: ""
};

const BlogPageWithTopPicks: React.FC = () => { return (<BlogPage showTopPicks />) }

export default BlogPageWithTopPicks;
