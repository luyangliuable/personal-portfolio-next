import FeaturedContentSection from "../../components/FeaturedContentSection/FeaturedContentSection";
import MusicPlayer from "../../components/MusicPlayer/MusicPlayer";
import Retro from "../../components/Retro/Retro";
import PostRepository from "../../repositories/PostRepository";

const TestHarnessPage = async () => {
    const postRepo = PostRepository.getInstance();
    const postList = await postRepo.getPostList();

    return (
        <main>
            <FeaturedContentSection postList={postList} />
        </main>
    )
}

export default TestHarnessPage;
