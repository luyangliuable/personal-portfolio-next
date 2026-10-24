import BlogContent from "../../../../page/BlogPage/BlogContent/BlogContent";
import { apiImageUrl } from "../../../../config/api";
import PostRepository from "../../../../repositories/PostRepository";
import BlogPostResponse from "../../../../repositories/Response/BlogPostResponse";
import {
    removeHashesAndStripWhitespace,
    truncateTextBody,
} from "../../../../components/Utility/StringUtility";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const postRepository = PostRepository.getInstance();
    const { id } = params;

    const content: BlogPostResponse | undefined =
        await postRepository.getPost(id);
    // getPost resolves undefined when the post or its markdown file is missing.
    if (!content) notFound();

    return {
        title: `Blog | ${content.heading}`,
        authors: { name: content.author },
        description: truncateTextBody(
            removeHashesAndStripWhitespace(content.body),
        ),
        openGraph: {
            images: content.image ? [apiImageUrl(content.image.$oid)] : [],
        },
    };
}

export default async function BlogContentServer({ params }: PageProps) {
    const { id } = params;
    const postRepository = PostRepository.getInstance();
    const content: BlogPostResponse | undefined =
        await postRepository.getPost(id);
    if (!content) notFound();

    return <BlogContent id={id} content={content} showRelatedPosts />;
}
