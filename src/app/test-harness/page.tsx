"use client";

import Accordion from "../../components/Accordion/Accordion";
import FeaturedContentSection from "../../components/FeaturedContentSection/FeaturedContentSection";
import MusicPlayer from "../../components/MusicPlayer/MusicPlayer";
import NavbarBurgerPanel from "../../components/Navbar/NavBurgerPanel/NavBurgerPanel";
import Retro from "../../components/Retro/Retro";
import PostRepository from "../../repositories/PostRepository";
import links from "../../configs/links.json";
import { useEffect } from "react";

const TestHarnessPage = () => {
    const postRepo = PostRepository.getInstance();
    /* const postList = await postRepo.getPostList(); */

    useEffect(() => {
        console.log(links);
    }, [links]);

    return <main className="h-screen"></main>;
};

export default TestHarnessPage;
