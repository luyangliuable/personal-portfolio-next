import React from "react";
import BlogPage from "../../../pages/BlogPage/BlogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Luyang's Blog",
    description: ""
};

const BlogPageWithTopPicks: React.FC = () => { return (<BlogPage showTopPicks />) }

export default BlogPageWithTopPicks;
