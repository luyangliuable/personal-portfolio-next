import BlogContent from "../../../../pages/BlogPage/BlogContent/BlogContent";
import PostRepository from "../../../../repositories/PostRepository";
import BlogPostResponse from "../../../../repositories/Response/BlogPostResponse";
import { truncateTextBody } from "../../../../components/Utility/StringUtility";
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
    description: truncateTextBody(content.body),
    openGraph: {
      images: [`https://llcode.tech/api/image/${content.image.$oid}`],
    },
  };
}


const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function BlogContentServer({ params }: PageProps) {
  const { id } = params;
    const postRepository = PostRepository.getInstance();
    const content: BlogPostResponse = await postRepository.getPost(id);

    /* await sleep(10000); */

    return <BlogContent id={id} content={content} />;
}
