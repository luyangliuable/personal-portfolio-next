import BlogPostResponse from "../../../repositories/Response/BlogPostResponse";

interface IFeaturedContentSectionState {
    featuredPosts: BlogPostResponse[];
    numberOfCardsEachRow: number,
    showAllPosts: boolean,
    featuredTool?: {
        name: string,
        description: string,
        link: string
    }
}

export default IFeaturedContentSectionState;
