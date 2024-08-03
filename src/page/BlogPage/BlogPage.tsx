"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { IBlogPageState, IBlogPageProps } from "../../interfaces";
import { FaWindowClose } from "react-icons/fa";
import HeroHeader from "../../components/HeroHeader/HeroHeader";
import BlogPostResponse from "../../repositories/Response/BlogPostResponse";
import Card from "../../components/Card/Card";
import BlogPostGraphics from "../../components/BlogPostGraphics/BlogPostGraphics";
import SmallCard from "../../components/Atoms/SmallCard/SmallCard";
import Toggle from "../../components/Atoms/Toggle/Toggle";
import "./BlogPage.css";
import SkeletonPage from "../SkeletonPage/SkeletonPage";
import { useGetPostListQuery } from "../../stores/Repository/Posts";
import LoadingBar from "../../components/LoadingBar/LoadingBar";

const BlogPage: React.FC<IBlogPageProps> = ({ showTopPicks, showLoadingSkeleton }) => {

    const router = useRouter();
    const authorImage = "https://llcode.tech/api/image/65817ae96c73ceb16ba51731";

    const heroHeaderContent = Object.freeze({
        heading: "Blog Posts",
        description: "Blog posts for documenting useful code, mark memorable moments in my life and help my journey of endless self-improvement.",
    });

    const [state, setState] = useState<IBlogPageState>({
        currentlyShowingContent: {},
        allTags: new Set(),
        currentSelectTags: [],
        topPickedPosts: []
    });

    const [displayLeetCodePosts, setDisplayLeetCodePosts] = useState<boolean>(false);

    const { data, isLoading, isError } = useGetPostListQuery();

    useEffect(() => {
        document.documentElement.scrollTo(0, 0);
        setState(prev => ({ ...prev, currentSelectTags: getCurrentSelectedTagsFromUrl() }));
    }, []);

    useEffect(() => {
        if (isLoading || isError) return;

        updateAllUniqueTags();
        updateTopPickedPosts();
    }, [data]);

    useEffect(() => {
        if (isLoading || isError) return;

        updateCurrentlyShowingContent();
        const { currentSelectTags: selectedTags } = state;
        if (selectedTags.includes("daily-leetcode") || selectedTags.includes("algorithms")) setDisplayLeetCodePosts(true);
    }, [data, state.currentSelectTags, displayLeetCodePosts]);

    const updateAllUniqueTags = () => {
        const uniqueTags: Set<string> = new Set();
        if (data) data.forEach(post => post.tags?.forEach(tag => uniqueTags.add(tag)));
        setState(prev => ({ ...prev, allTags: uniqueTags }));
    };

    const updateTopPickedPosts = () => {
        const topPickedPosts = data!.filter(post => post.is_featured);
        setState(prev => ({ ...prev, topPickedPosts }));
    };

    const updateCurrentlyShowingContent = () => {
        const { currentSelectTags: selectedTags } = state;
        const groupedPosts = groupPostsByYear(
            sortPostsByDate(data!)
                .filter(({ tags }) => isSubset(selectedTags, tags) || !selectedTags.length)
                .filter(({ tags }) => !tags.includes("daily-leetcode")
                    || displayLeetCodePosts
                    || selectedTags.includes("daily-leetcode")
                    || selectedTags.includes("algorithms"))
        );
        setState((prev: IBlogPageState) => ({ ...prev, currentlyShowingContent: groupedPosts }));
    };

    const isSubset = (array1: string[], array2: string[]): boolean => array1.every(item => array2.includes(item));

    const sortPostsByDate = (posts: BlogPostResponse[]): BlogPostResponse[] => {
        return [...posts].sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
    };

    const groupPostsByYear = (posts: BlogPostResponse[]): Record<string, BlogPostResponse[]> =>
        posts.reduce((groupedPosts, post) => {
            const year = new Date(post.date_created).getFullYear().toString();
            if (!groupedPosts[year]) {
                groupedPosts[year] = [];
            }
            groupedPosts[year].push(post);
            return groupedPosts;
        }, {} as Record<string, BlogPostResponse[]>);

    const getCurrentSelectedTagsFromUrl = (): string[] => {
        const currentSearch = window.location.search;
        const queryParams = new URLSearchParams(currentSearch);
        const tag = queryParams.get('tag');
        return tag ? tag.split(",") : [];
    };

    const renderPostsSortedByDateDescending = (): React.ReactNode => {
        return Object.keys(state.currentlyShowingContent)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map(year => (
                <React.Fragment key={year}>
                    <div className="blog__year position-relative"><span>{year}</span></div>
                    {
                        state.currentlyShowingContent[year].map((content: BlogPostResponse) => (
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
                                link={`/digital-chronicles/blog/${content._id.$oid}`}
                            />
                        ))
                    }
                </React.Fragment>
            ));
    };

    const renderTopPickedBlogPost = (): React.ReactNode | null => (
        showTopPicks && (
            <div className="w-half flex-col items-start pl-3vw blog__featured">
                <h3>Top Picks</h3>
                {state.topPickedPosts.map(post => (
                    <SmallCard
                        key={post._id.$oid}
                        authorImage={authorImage}
                        author={post.author}
                        link={`/digital-chronicles/blog/${post._id.$oid}`}
                        heading={post.heading}
                        image={post.image.$oid}
                        body=""
                    />
                ))}
            </div>
        )
    );

    const renderUnSelectedTags = () => {
        const baseUrlLink = "/digital-chronicles/blogs";
        const { currentSelectTags: selectedTags } = state;

        return Array.from(state.allTags).map(tagName => {
            const isSelected = state.currentSelectTags.includes(tagName);
            const updatedTags = isSelected
                ? selectedTags.filter(tag => tag !== tagName)
                : [...selectedTags, tagName];
            const to = `${baseUrlLink}?tag=${encodeURIComponent(updatedTags.join(","))}`;
            const handleClick = () => {
                router.push(to, { scroll: false });
                setState(prev => ({ ...prev, currentSelectTags: updatedTags }));
            };

            if (isSelected) {
                return (
                    <span
                        key={tagName}
                        className="blog__tag flex items-center noselect blog__tag--selected"
                        onClick={handleClick}
                    >
                        #{tagName} <FaWindowClose />
                    </span>
                );
            }

            const isDisabled = !data!.some(({ tags }) => isSubset([...selectedTags, tagName], tags));

            return (
                <span
                    key={tagName}
                    className={`blog__tag noselect ${isDisabled ? 'blog__tag--disabled' : 'cursor-pointer'}`}
                    onClick={!isDisabled ? handleClick : undefined}
                >
                    #{tagName}
                </span>
            );
        });
    };

    const renderDisplayLeetCodePostsToggleButton = () => {
        const { currentSelectTags: selectedTags } = state;
        const displayLeetCodePostsToggleButtonDisabled = selectedTags.includes("daily-leetcode") || selectedTags.includes("algorithms");
        return <Toggle disabled={displayLeetCodePostsToggleButtonDisabled} setToggleState={setDisplayLeetCodePosts} toggleState={displayLeetCodePosts} />;
    }

    return (
        <main className="flex items-center">
            <HeroHeader heading={heroHeaderContent.heading} description={heroHeaderContent.description} graphics={<BlogPostGraphics />} />
            {!isLoading &&
                <article className="blog-container flex w-full">
                    <section className="blog-list flex flex-col w-full items-center">
                        <div className="blog-page--options-container flex">
                            <ul className="blog__tag-container flex justify-center flex-wrap">{renderUnSelectedTags()}</ul>
                            {data!.length > 0 && renderDisplayLeetCodePostsToggleButton()}
                        </div>
                        <div className="w-full flex flex-col items-center">{renderPostsSortedByDateDescending()}</div>
                    </section>
                    {renderTopPickedBlogPost()}
                </article>
            }
            {isLoading &&
                <div className="loading-bar--container">
                    <LoadingBar />
                </div>
            }
        </main >
    );
};

export default React.memo(BlogPage);
