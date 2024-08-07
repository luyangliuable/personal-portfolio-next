import React from "react";
import BlogPostResponse from "../../../../repositories/Response/BlogPostResponse";
import BuyMeACoffeeButton from "../BuyMeACoffeeButton/BuyMeACoffeeButton";
import Link from "next/link";
import AuthorDetails from "../AuthorDetails/AuthorDetails";
import { cardGradientEffect } from "../../../../components/Utility/MouseUtility";
import TagCloud from "../../../../components/TagCloud/TagCloud";
import "./PostDetailsPanel.css";

type IPostDetailsPanelProps = {
  content?: BlogPostResponse,
  relatedPosts?: BlogPostResponse[]
}

const PostDetailsPanel: React.FC<IPostDetailsPanelProps> = ({ content, relatedPosts }) => {
  if (content === undefined) {
    return (
      <></>
    );
  }

  const renderRelatedPosts = (): React.ReactNode => {
    if (!relatedPosts) {
      return <p>Error loading related posts.</p>;
    }

    return (
      <div>
        <h3>Related Posts</h3>
        {
         relatedPosts.map((post: BlogPostResponse, idx: number) => {
           const { heading, author } = post;
           const link = `/digital-chronicles/blog/${post._id.$oid}`;
           return (
             <Link className="w-80" href={link} key={idx}>
               <div className="card no-boundary px-1" onMouseMove={cardGradientEffect}>
                 <h4 className="mb-0">{heading}</h4>
                 <p className="m-0">{author}</p>
               </div>
             </Link>
           )
        })}
      </div>
    );
  }

  const renderBlogTags = (): React.ReactNode => {
    const { tags } = content;
    return (
      <div>
        <h3>Tags</h3>
        <TagCloud tags={tags} />
      </div>
    );
  }

  return (
    <aside className="blog-content__side-components child-mb-50 flex flex-col items-start mt-10">
      <section>
        <h3>Author</h3>
        <AuthorDetails content={content} />
      </section>
      <div className="child-mb-10">{renderRelatedPosts()}</div>
      <aside className="w-80">{renderBlogTags()}</aside>
      <BuyMeACoffeeButton />
    </aside>
  );
}

export default PostDetailsPanel;
