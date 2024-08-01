import BlogContent from "../../../../page/BlogPage/BlogContent/BlogContent";
import PostRepository from "../../../../repositories/PostRepository";
import BlogPostResponse from "../../../../repositories/Response/BlogPostResponse";
import { removeHashesAndStripWhitespace, truncateTextBody } from "../../../../components/Utility/StringUtility";
import type { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const postRepository = PostRepository.getInstance();
  const { id } = params;

  const content: BlogPostResponse = await postRepository.getPost(id);

  return {
    title: `Blog | ${content.heading}`,
    authors: { name: content.author },
    description: truncateTextBody(removeHashesAndStripWhitespace(content.body)),
    openGraph: {
      images: [`https://llcode.tech/api/image/${content.image.$oid}`],
    },
  };
}


export default async function BlogContentServer({ params }: PageProps) {
  const { id } = params;
    const postRepository = PostRepository.getInstance();
    const content: BlogPostResponse = await postRepository.getPost(id);

    return <BlogContent id={id} content={content} showRelatedPosts/>;
}
