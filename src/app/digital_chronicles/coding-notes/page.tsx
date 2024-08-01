"use client";

import React, { useEffect } from "react";
import type { Metadata } from "next";
import HeroHeader from "../../../components/HeroHeader/HeroHeader";
import { useGetNoteListQuery } from "../../../stores/Repository/Notes";
import Card from "../../../components/Card/Card";
import { Accordion } from "../../../components/Accordion/Accordion";
import BlogPostResponse from "../../../repositories/Response/BlogPostResponse";

/* export const metadata: Metadata = {
 *     title: "Luyang's Coding Notes",
 *     description: ""
 * }; */

const BlogPageWithTopPicks: React.FC = () => {
    const heroHeaderContent = Object.freeze({
        heading: "Coding Notes",
        description: "My personal coding notes and snippets, organized by language and topic that I wrote during the nostalgic days at University."
    });

    const { data, error, isLoading } = useGetNoteListQuery();

    useEffect(() => {
        console.log(data);
    }, [])

    if (isLoading) return (<></>);
    if (error) return <div>Error</div>;

    const grouped = data!.reduce((acc: Record<string, any>, item: BlogPostResponse) => {
        const tagName = item.tags.length > 0 ? item.tags[0] : "random";

        if (acc.hasOwnProperty(tagName)) {
            acc[tagName].push(item);
        } else {
            acc[tagName] = [item];
        }

        return acc;
    }, {});

    const authorImage = "https://llcode.tech/api/image/65817ae96c73ceb16ba51731";
    return (
        <main>
            <HeroHeader heading={heroHeaderContent.heading} description={heroHeaderContent.description} />
            <Accordion>
                {
                    Object.keys(grouped).map(category => {
                        return (
                            <Accordion.Item heading={category}>
                                {grouped[category].map(( content: BlogPostResponse ) => {
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
                            </Accordion.Item>
                        )
                    })
                }
            </Accordion>
        </main>
    );
}

export default BlogPageWithTopPicks;
