import BlogPostResponse from "../../repositories/Response/BlogPostResponse";

interface IBlogPageProps {
  data: BlogPostResponse[]
  showTopPicks?: boolean
  showLoadingSkeleton?: boolean
}

export default IBlogPageProps;
