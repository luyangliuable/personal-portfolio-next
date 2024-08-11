import LandingPage from '../page/LandingPage/LandingPage';
import PostRepository from '../repositories/PostRepository';

export default async function App() {
    const postRepo = PostRepository.getInstance();
    const postList = await postRepo.getPostList();

    return (<LandingPage postList={postList} />);
}
