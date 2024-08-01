import BlogPostResponse from "../../repositories/Response/BlogPostResponse";

export interface IBlogPageState {
    currentlyShowingContent: Record<string, BlogPostResponse[]>,
    allTags: Set<string>,
    currentSelectTags: string[],
    topPickedPosts: BlogPostResponse[],
    render?: () => React.ReactElement<any, any>,
}
