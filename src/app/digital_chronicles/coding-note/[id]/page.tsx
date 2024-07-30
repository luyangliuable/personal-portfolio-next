import BlogContent from "../../../../page/BlogPage/BlogContent/BlogContent";
import PostRepository from "../../../../repositories/PostRepository";
import BlogPostResponse from "../../../../repositories/Response/BlogPostResponse";
import { truncateTextBody } from "../../../../components/Utility/StringUtility";
import type { Metadata } from "next";
import NoteRepository from "../../../../repositories/NoteRepository";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const repo = NoteRepository.getInstance();
  const { id } = params;

  const content: BlogPostResponse = await repo.getPost(id);

  return {
    title: `Blog | ${content.heading}`,
    authors: { name: content.author },
    description: truncateTextBody(content.body),
    openGraph: {
    },
  };
}


export default async function BlogContentServer({ params }: PageProps) {
  const { id } = params;
  const repo = NoteRepository.getInstance();
  const content: BlogPostResponse = await repo.getPost(id);

  return <BlogContent id={id} content={content} />;
}
