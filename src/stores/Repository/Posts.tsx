import { API_BASE_URL } from "../../config/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BlogPostResponse from "../../repositories/Response/BlogPostResponse";

export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getPostList: builder.query<BlogPostResponse[], void>({
            query: () => `posts`,
        }),
        getPost: builder.query<BlogPostResponse, string>({
            query: (id) => `posts/${id}`,
        }),
    }),
});

export const { useGetPostListQuery, useGetPostQuery } = postApi;
