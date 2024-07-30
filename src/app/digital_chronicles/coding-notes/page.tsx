"use client";

import React, { useEffect } from "react";
import BlogPage from "../../../page/BlogPage/BlogPage";
import type { Metadata } from "next";
import HeroHeader from "../../../components/HeroHeader/HeroHeader";
import { useGetNoteListQuery } from "../../../stores/Repository/Notes";
import Card from "../../../components/Card/Card";

/* export const metadata: Metadata = {
*     title: "Luyang's Coding Notes",
*     description: ""
* }; */

const BlogPageWithTopPicks: React.FC = () => {
    const heroHeaderContent = Object.freeze({
        heading: "Coding Notes",
        description: "My personal coding notes and snippets, organized by language and topic. The approach is by helping you learn by looking at examples."
    });

    const { data, error, isLoading } = useGetNoteListQuery();

    useEffect(() => {
        console.log(data);
    }, [])

    if (isLoading) return (<></>);
    if (error) return <div>Error</div>;

    const authorImage = "https://llcode.tech/api/image/65817ae96c73ceb16ba51731";
    return (
        <main>
            <HeroHeader heading={heroHeaderContent.heading} description={heroHeaderContent.description} />
            {data!.map(content => {
                return (
                    <Card
                        key={content._id.$oid}
                        heading={content.heading}
                        authorImage={authorImage}
                        author={content.author}
                        date_created={content.date_created}
                        date_updated={content.date_last_modified}
                        body={content.body}
                        minuteRead={content.reading_time_minutes}
                        in_progress={content.in_progress}
                        tags={content.tags}
                        image={content.image && content.image.$oid}
                        link={`/digital_chronicles/coding-note/${content._id.$oid}`}
                    />
                )
            })}
        </main>
    );
}

export default BlogPageWithTopPicks;
