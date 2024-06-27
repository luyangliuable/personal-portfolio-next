"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { marked } from "marked";
import { isCenterAlignedWithViewport } from "../../../components/Utility/ScrollUtility";
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

const BlogContent: React.FC<IBlogContentProps> = ({ id, content }) => {
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
      if (content) {
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
          const offset = isCenterAlignedWithViewport(section);
          const threshold = window.innerHeight/2
          return offset <= threshold && offset >= -threshold;
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
  const showSides = (headings.length !== 0 && relatedPosts);

  return (
    <main className="page-container">
      <section className="blog-content__wrapper">
        {content && (
          <>
            {showSides && <PostDetailsPanel content={content} relatedPosts={relatedPosts} />}
            {renderBlogContent()}
            {showSides && (
              <aside className="blog-content__side-components position-sticky mt-20vh">
                <Link href="/digital_chronicles/blogs" className="flex items-center">
                  <IoMdArrowBack />
                  Back to Blogs
                </Link>
                <TableOfContent emitter={emitter} headings={headings} />
              </aside>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default React.memo(BlogContent);
