import BlogPostResponse from "./Response/BlogPostResponse";
import Repository from "./Repository";

class NoteRepository extends Repository {
    private static instance: NoteRepository;
    private static postListCache: any[] | null = null;
    static BASE_URL: string = "https://llcode.tech/api/note";

    private constructor() { super(); }

    static getInstance(): NoteRepository {
        if (!NoteRepository.instance) NoteRepository.instance = new NoteRepository();
        return NoteRepository.instance;
    }

    sortPostsByDate(posts: BlogPostResponse[], type?: "asc" | "desc"): BlogPostResponse[] {
        return [...posts].sort((a, b) => {
            const dateA = new Date(a.date_created).getTime();
            const dateB = new Date(b.date_created).getTime();
            return type === "asc" ? dateA - dateB : dateB - dateA;
        });
    }

    async getFeaturedPostList(): Promise<BlogPostResponse[]> {
        const postList = await this.getPostList();
        const featuredPosts = postList.filter((post: BlogPostResponse) => post.is_featured);
        return this.sortPostsByDate(featuredPosts);
    }

    async getRelatedPosts(tags: string[], currentPostId: string, numberOfResults: number = 3): Promise<BlogPostResponse[]> {
        try {
            const allPosts = await this.getPostList();
            const postsWithCommonTags = allPosts.map((post: BlogPostResponse) => ({
                post,
                commonTags: post.tags.filter((tag: string) => tags.includes(tag)).length,
            }));
            postsWithCommonTags.sort((a: any, b: any) => b.commonTags - a.commonTags);
            return postsWithCommonTags.slice(0, numberOfResults + 1).map((item: any) => item.post).filter((post: BlogPostResponse) => post._id.$oid !== currentPostId);
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async getPostList(): Promise<BlogPostResponse[]> {
        if (NoteRepository.postListCache) return Promise.resolve(NoteRepository.postListCache);
        const url = NoteRepository.BASE_URL;
        const options = NoteRepository.options("GET");
        return fetch(url, options)
            .then(response => response.json())
            .then(data => {
                NoteRepository.postListCache = this.sortPostsByDate(data);
                return NoteRepository.postListCache;
            })
            .catch(error => {
                console.error('Error:', error)
                return [];
            });
    }

    async getPost(id: string): Promise <BlogPostResponse> {
        const url = `${NoteRepository.BASE_URL}/${id}`;
        const options = NoteRepository.options("GET");
        return fetch(url, options)
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    }
}

export default NoteRepository;
