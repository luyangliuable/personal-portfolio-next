import { configureStore } from '@reduxjs/toolkit';
import { postApi } from "./Repository/Posts";
import authReducer from "./Repository/Auth";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [postApi.reducerPath]: postApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
