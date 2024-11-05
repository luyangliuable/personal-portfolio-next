"use client";

import PostRepository from "../../repositories/PostRepository";
import FractalHills from "../../components/FractalHills/FractalHills";
import links from "../../configs/links.json";
import { useEffect } from "react";

const TestHarnessPage = () => {
    const postRepo = PostRepository.getInstance();

    useEffect(() => {
        console.log(links);
    }, [links]);

    return <main className="h-screen">{/* <FractalHills /> */}</main>;
};

export default TestHarnessPage;
