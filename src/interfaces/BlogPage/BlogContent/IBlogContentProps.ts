import BlogPostResponse from "../../../repositories/Response/BlogPostResponse";

interface BlogContentProps {
    id: string;
    showRelatedPosts?: boolean;
    content: BlogPostResponse;
    scrolled?: number;
}

export default BlogContentProps;
