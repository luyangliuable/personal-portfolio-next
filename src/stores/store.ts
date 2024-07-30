import { configureStore } from '@reduxjs/toolkit';
import { postApi } from "./Repository/Posts";
import { notesApi } from "./Repository/Notes";
import authReducer from "./Repository/Auth";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [postApi.reducerPath]: postApi.reducer,
        [notesApi.reducerPath]: notesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postApi.middleware, notesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
