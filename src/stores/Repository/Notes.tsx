import { API_BASE_URL } from "../../config/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BlogPostResponse from "../../repositories/Response/BlogPostResponse";

export const notesApi = createApi({
    reducerPath: "notesApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getNoteList: builder.query<BlogPostResponse[], void>({
            query: () => `note`,
        }),
        getNote: builder.query<BlogPostResponse, string>({
            query: (id) => `note/${id}`,
        }),
    }),
});

export const { useGetNoteListQuery, useGetNoteQuery } = notesApi;
