import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    username: string;
    level: number;
    xp: number;
    totalXpEarned: number;
    focusAreas: string[];
    isGuest?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    onboardingComplete: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    onboardingComplete: false,
};

// Thunks
export const loadStoredAuth = createAsyncThunk(
    'auth/loadStoredAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            const onboarding = await AsyncStorage.getItem('onboardingComplete');

            if (token && userStr) {
                const user = JSON.parse(userStr);
                api.setAuthToken(token);
                return {
                    token,
                    user,
                    onboardingComplete: onboarding === 'true',
                };
            }
            return { token: null, user: null, onboardingComplete: onboarding === 'true' };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
);

export const register = createAsyncThunk(
    'auth/register',
    async (
        data: { email: string; password: string; username: string; focusAreas: string[] },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/auth/register', data);
            const { token, user } = response.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('onboardingComplete', 'true');
            api.setAuthToken(token);

            return { token, user };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Registration failed',
            );
        }
    },
);

export const login = createAsyncThunk(
    'auth/login',
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', data);
            const { token, user } = response.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            api.setAuthToken(token);

            return { token, user };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Login failed',
            );
        }
    },
);

export const loginAsGuest = createAsyncThunk(
    'auth/loginAsGuest',
    async (_, { rejectWithValue }) => {
        try {
            // Create a local guest user (works offline without backend)
            const guestId = `guest_${Date.now()}`;
            const guestUser: User = {
                id: guestId,
                email: 'guest@dailyxp.app',
                username: 'Guest User',
                level: 1,
                xp: 0,
                totalXpEarned: 0,
                focusAreas: ['Health', 'Productivity'],
                isGuest: true,
            };
            const guestToken = `guest_token_${guestId}`;

            await AsyncStorage.setItem('token', guestToken);
            await AsyncStorage.setItem('user', JSON.stringify(guestUser));

            return { token: guestToken, user: guestUser };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Guest login failed');
        }
    },
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    api.setAuthToken(null);
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
        setOnboardingComplete: state => {
            state.onboardingComplete = true;
            AsyncStorage.setItem('onboardingComplete', 'true');
        },
        updateUserXp: (
            state,
            action: PayloadAction<{ xp: number; level: number; totalXpEarned: number }>,
        ) => {
            if (state.user) {
                state.user.xp = action.payload.xp;
                state.user.level = action.payload.level;
                state.user.totalXpEarned = action.payload.totalXpEarned;
                AsyncStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
    extraReducers: builder => {
        // Load stored auth
        builder.addCase(loadStoredAuth.pending, state => {
            state.isLoading = true;
        });
        builder.addCase(loadStoredAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = !!action.payload.token;
            state.onboardingComplete = action.payload.onboardingComplete;
        });
        builder.addCase(loadStoredAuth.rejected, state => {
            state.isLoading = false;
        });

        // Register
        builder.addCase(register.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.onboardingComplete = true;
            state.error = null;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Login
        builder.addCase(login.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Guest login
        builder.addCase(loginAsGuest.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginAsGuest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
        });
        builder.addCase(loginAsGuest.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logout.fulfilled, state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        });
    },
});

export const { clearError, setOnboardingComplete, updateUserXp } = authSlice.actions;
export default authSlice.reducer;
