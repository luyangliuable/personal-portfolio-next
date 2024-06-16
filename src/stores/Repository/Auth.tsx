import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserData } from '../../page/RegisterPage/RegisterPage';

interface AuthState {
    user: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
};

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: UserData, thunkAPI) => {
        try {
            const response = await fetch('https://llcode.tech/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData: { username: string; password: string }, thunkAPI) => {
        try {
            const response = await fetch('https://llcode.tech/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to login');
            }
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export type AuthUserResponse = { username: string };

export const authUser = createAsyncThunk<AuthUserResponse, void>('auth/fetchUserDetails', async (_, thunkAPI) => {
    try {
        const response = await fetch('https://llcode.tech/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user details');
        }
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.username;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.userid;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(authUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(authUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.username;
                // assuming you want to store both username and userid in the state, consider creating a user object
                // state.user = action.payload.userid; // remove this line if `state.user` should be a string
            })
            .addCase(authUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
