"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { marked } from "marked";
import { getVisiblePercentage, isCenterAlignedWithViewport } from "../../../components/Utility/ScrollUtility";
import { IoMdArrowBack } from "react-icons/io";
import { IBlogContentState } from "../../../interfaces/BlogPage/BlogContent/IBlogContentState";
import IBlogContentProps from "../../../interfaces/BlogPage/BlogContent/IBlogContentProps";
import { EventEmitter } from "events";
import PostRepository from "../../../repositories/PostRepository";
import MarkdownRendererV2 from "./MarkdownRendererV2/MarkdownRendererV2";
import TableOfContent from "./TableOfContents/TableOfContents";
import Image from "../../../components/Image/Image";
import PostDetailsPanel from "./PostDetailsPanel/PostDetailsPanel";
import AuthorDetails from "./AuthorDetails/AuthorDetails";
import { useScrollPosition } from "../../../hooks";
import "./BlogContent.css";
import "./CodeBlock/CodeBlock.css";

const BlogContent: React.FC<IBlogContentProps> = ({ id, content, showRelatedPosts }) => {
  const postRepository = useMemo(() => PostRepository.getInstance(), []);

  const emitter = useMemo(() => new EventEmitter(), []);
  const { scrollY: scrolled } = useScrollPosition();

  const [state, setState] = useState<IBlogContentState>({
    headings: [],
    cache: {
      fetchedImageUrl: "",
      fetchedAuthorImageUrl: "",
    },
  });

  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateBlogContentHeadings = (): void => {
      if (content) {
        console.log(content.body);
        const renderer = new marked.Renderer();
        const originalHeadingRenderer = renderer.heading.bind(renderer);
        let headings: { title: string; level: number }[] = [];
        renderer.heading = (text, level) => {
          headings.push({ title: text, level });
          return originalHeadingRenderer(text, level, "");
        };
        marked(content.body, { renderer });
        setState((prev) => ({ ...prev, headings }));
      }
    };

    async function updatedRelatedPosts(): Promise<void> {
      if (content && showRelatedPosts) {
        const { tags, _id } = content;
        const relatedPosts = await postRepository.getRelatedPosts(tags, _id.$oid, 3);
        setState((prev) => ({ ...prev, relatedPosts }));
      }
    }

    updatedRelatedPosts();
    updateBlogContentHeadings();
  }, [content, postRepository]);

  useEffect(() => {
    function observeSections(): void {
      const sections = document.querySelectorAll(".blog-section, .blog-section--root");
      const sectionsArray = Array.from(sections);
      const intersectingSections = sectionsArray
        .filter((section) => {
            const visibleSectionPerc = getVisiblePercentage(section);
            const threshold = 10; // at least 10% visible
            return visibleSectionPerc >= threshold;
        })
              .map((section) => section.id);

          if (intersectingSections.length > 0) {
              emitter.emit("intersectingSections", intersectingSections);
          }
      }

      observeSections();
  }, [scrolled, emitter]);

    function renderBlogContent(): React.ReactNode {
        if (!content) return null; // Check if content is undefined

        const { heading, image, body, _id } = content;
        const imageId = image?.$oid;

        if (!body) return (<></>);

        return (
            <article className="blog-content box-shadow">
                <header className="blog-content__header">
                    <h1>{heading}</h1>
                    <AuthorDetails content={content} />
                </header>
                <Image alt="" className="blog-content__image" src={imageId} />
                <section className="w-full flex-col justify-center items-center translucent-white table-of-content--small-screen">
                    <TableOfContent className="w-80" headings={state.headings} />
                </section>
                <section className="blog-content-body">
                    <MarkdownRendererV2 key={_id.$oid} markdown={body} />
                </section>
            </article>
        );
    }

    const { relatedPosts, headings } = state;

    return (
        <main className="page-container">
            <section className="blog-content__wrapper">
                {content && (
                    <>
                        {<PostDetailsPanel content={content} relatedPosts={relatedPosts} />}
                        {renderBlogContent()}
                        <aside className="blog-content__side-components position-sticky mt-20vh">
                            <Link shallow href="/digital-chronicles/blogs" className="flex items-center">
                                <IoMdArrowBack />
                                Back to Blogs
                            </Link>
                            <TableOfContent emitter={emitter} headings={headings} />
                        </aside>
                    </>
                )}
            </section>
        </main>
    );
};

export default React.memo(BlogContent);
