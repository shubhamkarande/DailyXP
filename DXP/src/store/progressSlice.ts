import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface DaySummary {
    completedHabits: number;
    totalHabits: number;
    xpEarned: number;
    isPerfectDay: boolean;
}

interface Stats {
    totalCompletions: number;
    longestStreak: number;
    activeHabits: number;
}

interface StreakInfo {
    habitId: string;
    title: string;
    icon: string;
    currentStreak: number;
    longestStreak: number;
    lastCompletedAt: string | null;
    completedToday: boolean;
}

interface ChartData {
    date: string;
    dayName: string;
    xp: number;
    completions: number;
}

interface ProgressState {
    today: DaySummary | null;
    stats: Stats | null;
    streaks: StreakInfo[];
    chartData: ChartData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ProgressState = {
    today: null,
    stats: null,
    streaks: [],
    chartData: [],
    isLoading: false,
    error: null,
};

// Thunks
export const fetchSummary = createAsyncThunk(
    'progress/fetchSummary',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/progress/summary');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch summary',
            );
        }
    },
);

export const fetchStreaks = createAsyncThunk(
    'progress/fetchStreaks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/progress/streaks');
            return response.data.streaks;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch streaks',
            );
        }
    },
);

export const fetchChartData = createAsyncThunk(
    'progress/fetchChartData',
    async (days: number = 7, { rejectWithValue }) => {
        try {
            const response = await api.get(`/progress/chart?days=${days}`);
            return response.data.chartData;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch chart data',
            );
        }
    },
);

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
        updateTodayStats: (state, action) => {
            if (state.today) {
                state.today.completedHabits = action.payload.completedHabits;
                state.today.xpEarned = action.payload.xpEarned;
                state.today.isPerfectDay =
                    state.today.completedHabits === state.today.totalHabits;
            }
        },
    },
    extraReducers: builder => {
        // Fetch summary
        builder.addCase(fetchSummary.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchSummary.fulfilled, (state, action) => {
            state.isLoading = false;
            state.today = action.payload.today;
            state.stats = action.payload.stats;
        });
        builder.addCase(fetchSummary.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch streaks
        builder.addCase(fetchStreaks.pending, state => {
            state.isLoading = true;
        });
        builder.addCase(fetchStreaks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.streaks = action.payload;
        });
        builder.addCase(fetchStreaks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch chart data
        builder.addCase(fetchChartData.pending, state => {
            state.isLoading = true;
        });
        builder.addCase(fetchChartData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.chartData = action.payload;
        });
        builder.addCase(fetchChartData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearError, updateTodayStats } = progressSlice.actions;
export default progressSlice.reducer;
