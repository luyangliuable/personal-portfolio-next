import BlogContent from "../../../../pages/BlogPage/BlogContent/BlogContent";
import { configureStore } from '@reduxjs/toolkit'


interface PageProps {
    params: {
        id: string;
    };
}


export default function BlogContentServer({ params }: PageProps) {
    const { id } = params;

    return (<BlogContent id={ id } />);
}
