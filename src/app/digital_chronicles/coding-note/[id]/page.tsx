import BlogContent from "../../../../page/BlogPage/BlogContent/BlogContent";
import BlogPostResponse from "../../../../repositories/Response/BlogPostResponse";
import { removeHashesAndStripWhitespace, truncateTextBody } from "../../../../components/Utility/StringUtility";
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
    title: `Notes | ${content.heading}`,
    authors: { name: content.author },
    description: truncateTextBody(removeHashesAndStripWhitespace(content.body)),
    openGraph: {
      images: [`https://wallhaven.cc/w/gpgyw3`]
    },
  };
}


export default async function BlogContentServer({ params }: PageProps) {
  const { id } = params;
  const repo = NoteRepository.getInstance();
  const content: BlogPostResponse = await repo.getPost(id);

  return <BlogContent id={id} content={content} />;
}
