import BlogPostResponse from "../../../repositories/Response/BlogPostResponse";

interface BlogContentProps {
    id: string;
    content: BlogPostResponse;
    scrolled?: number;
}

export default BlogContentProps;
