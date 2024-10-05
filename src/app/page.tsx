import LandingPage from '../page/LandingPage/LandingPage';
import PostRepository from '../repositories/PostRepository';
import { auth } from "../auth";

export default async function App() {
    const postRepo = PostRepository.getInstance();
    const postList = await postRepo.getPostList();

    const session = await auth();

    return (
        <>
            <LandingPage postList={postList} />
        </>
    );
}
