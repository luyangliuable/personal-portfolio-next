import { RootState } from '../store';

export const selectIsLoggedIn = (state: RootState) => state.auth.status === "succeeded";
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
