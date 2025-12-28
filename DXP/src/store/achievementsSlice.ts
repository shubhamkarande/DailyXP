import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    xpReward: number;
    unlocked: boolean;
    unlockedAt?: string;
    requirement: {
        type: string;
        value: number;
    };
}

interface AchievementsState {
    achievements: Achievement[];
    recentUnlocks: Achievement[];
    stats: {
        unlocked: number;
        total: number;
        progress: number;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: AchievementsState = {
    achievements: [],
    recentUnlocks: [],
    stats: {
        unlocked: 0,
        total: 0,
        progress: 0,
    },
    isLoading: false,
    error: null,
};

export const fetchAchievements = createAsyncThunk(
    'achievements/fetchAchievements',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/achievements');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch achievements',
            );
        }
    },
);

export const checkAchievements = createAsyncThunk(
    'achievements/checkAchievements',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/achievements/check');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to check achievements',
            );
        }
    },
);

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
        addRecentUnlock: (state, action) => {
            state.recentUnlocks.unshift(action.payload);
            if (state.recentUnlocks.length > 5) {
                state.recentUnlocks.pop();
            }
        },
        clearRecentUnlocks: state => {
            state.recentUnlocks = [];
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchAchievements.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchAchievements.fulfilled, (state, action) => {
            state.isLoading = false;
            state.achievements = action.payload.achievements;
            state.stats = action.payload.stats;
        });
        builder.addCase(fetchAchievements.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        builder.addCase(checkAchievements.fulfilled, (state, action) => {
            // Add newly unlocked achievements to recent
            if (action.payload.newAchievements) {
                action.payload.newAchievements.forEach((achievement: Achievement) => {
                    state.recentUnlocks.unshift(achievement);
                });
            }
        });
    },
});

export const { clearError, addRecentUnlock, clearRecentUnlocks } =
    achievementsSlice.actions;
export default achievementsSlice.reducer;
