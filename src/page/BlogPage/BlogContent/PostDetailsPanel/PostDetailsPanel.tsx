import React from "react";
import BlogPostResponse from "../../../../repositories/Response/BlogPostResponse";
import BuyMeACoffeeButton from "../BuyMeACoffeeButton/BuyMeACoffeeButton";
import Link from "next/link";
import AuthorDetails from "../AuthorDetails/AuthorDetails";
import "../../../../components/Card/Card.css";
import { cardGradientEffect } from "../../../../components/Utility/MouseUtility";
import TagCloud from "../../../../components/TagCloud/TagCloud";
import "./PostDetailsPanel.css";

type IPostDetailsPanelProps = {
    content?: BlogPostResponse;
    relatedPosts?: BlogPostResponse[];
};

// Reusable Section Wrapper Component
const SectionWrapper: React.FC<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => (
    <div className="child-mb-10 w-full">
        <h3 className="font-bold mb-2 pb-1 border-b border-gray-300 w-[80%]">
            {title}
        </h3>
        {children}
    </div>
);

const PostDetailsPanel: React.FC<IPostDetailsPanelProps> = ({
    content,
    relatedPosts,
}) => {
    if (!content) {
        return null;
    }

    const renderRelatedPosts = (): React.ReactNode => {
        if (!relatedPosts) {
            return null;
        }

        return relatedPosts.map((post: BlogPostResponse, idx: number) => {
            const { heading, author } = post;
            const link = `/digital-chronicles/blog/${post._id.$oid}`;
            return (
                <Link className="w-4/5" href={link} key={idx}>
                    <div
                        className="card no-boundary p-[8px] ml-[-8px]"
                        onMouseMove={cardGradientEffect}
                    >
                        <h4 className="mb-0 font-bold">{heading}</h4>
                        <p className="m-0">{author}</p>
                    </div>
                </Link>
            );
        });
    };

    const renderBlogTags = (): React.ReactNode => {
        const { tags } = content;
        return <TagCloud tags={tags} />;
    };

    return (
        <aside className="blog-content__side-components child-mb-50 flex flex-col items-start mt-10">
            <SectionWrapper title="Author">
                <AuthorDetails content={content} />
            </SectionWrapper>
            <SectionWrapper title="Related Posts">
                {renderRelatedPosts()}
            </SectionWrapper>
            <SectionWrapper title="Tags">{renderBlogTags()}</SectionWrapper>
            <BuyMeACoffeeButton />
        </aside>
    );
};

export default PostDetailsPanel;
