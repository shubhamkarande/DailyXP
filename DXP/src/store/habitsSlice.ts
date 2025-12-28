import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { updateUserXp } from './authSlice';

export interface Habit {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    icon: string;
    difficulty: 'easy' | 'medium' | 'hard';
    frequency: 'daily' | 'weekly';
    focusArea: string;
    currentStreak: number;
    longestStreak: number;
    lastCompletedAt: string | null;
    totalCompletions: number;
    totalXpEarned: number;
    isActive: boolean;
    completedToday: boolean;
    createdAt: string;
}

interface CompletionResult {
    xpEarned: number;
    baseXp: number;
    streakBonus: number;
    streakMultiplier: number;
    newStreak: number;
    streakBroken: boolean;
    leveledUp: boolean;
    previousLevel: number;
    newLevel: number;
    currentXp: number;
    xpForNextLevel: number;
    totalXpEarned: number;
}

interface HabitsState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;
    lastCompletion: CompletionResult | null;
    showLevelUpModal: boolean;
}

const initialState: HabitsState = {
    habits: [],
    isLoading: false,
    error: null,
    lastCompletion: null,
    showLevelUpModal: false,
};

// Local storage keys
const HABITS_STORAGE_KEY = 'habits_cache';

// Thunks
export const fetchHabits = createAsyncThunk(
    'habits/fetchHabits',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/habits');
            const habits = response.data.habits;

            // Cache habits locally for offline support
            await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));

            return habits;
        } catch (error: any) {
            // Try to load from cache if offline
            const cached = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch habits',
            );
        }
    },
);

export const createHabit = createAsyncThunk(
    'habits/createHabit',
    async (
        data: {
            title: string;
            description?: string;
            icon?: string;
            difficulty: string;
            frequency: string;
            focusArea?: string;
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/habits', data);
            return response.data.habit;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to create habit',
            );
        }
    },
);

export const completeHabit = createAsyncThunk(
    'habits/completeHabit',
    async (habitId: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post(`/habits/${habitId}/complete`);
            const result = response.data;

            // Update user XP in auth slice
            dispatch(
                updateUserXp({
                    xp: result.currentXp,
                    level: result.newLevel,
                    totalXpEarned: result.totalXpEarned,
                }),
            );

            return { habitId, ...result };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to complete habit',
            );
        }
    },
);

export const deleteHabit = createAsyncThunk(
    'habits/deleteHabit',
    async (habitId: string, { rejectWithValue }) => {
        try {
            await api.delete(`/habits/${habitId}`);
            return habitId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to delete habit',
            );
        }
    },
);

const habitsSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
        clearLastCompletion: state => {
            state.lastCompletion = null;
        },
        hideLevelUpModal: state => {
            state.showLevelUpModal = false;
        },
    },
    extraReducers: builder => {
        // Fetch habits
        builder.addCase(fetchHabits.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchHabits.fulfilled, (state, action) => {
            state.isLoading = false;
            state.habits = action.payload;
        });
        builder.addCase(fetchHabits.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create habit
        builder.addCase(createHabit.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createHabit.fulfilled, (state, action) => {
            state.isLoading = false;
            state.habits.unshift({ ...action.payload, completedToday: false });
        });
        builder.addCase(createHabit.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Complete habit
        builder.addCase(completeHabit.pending, state => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(completeHabit.fulfilled, (state, action) => {
            state.isLoading = false;

            // Update the habit in the list
            const index = state.habits.findIndex(
                h => h._id === action.payload.habitId,
            );
            if (index !== -1) {
                state.habits[index].completedToday = true;
                state.habits[index].currentStreak = action.payload.newStreak;
                state.habits[index].totalCompletions += 1;
                state.habits[index].totalXpEarned += action.payload.xpEarned;
                state.habits[index].lastCompletedAt = new Date().toISOString();
            }

            // Store completion result
            state.lastCompletion = action.payload;

            // Show level up modal if needed
            if (action.payload.leveledUp) {
                state.showLevelUpModal = true;
            }
        });
        builder.addCase(completeHabit.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Delete habit
        builder.addCase(deleteHabit.fulfilled, (state, action) => {
            state.habits = state.habits.filter(h => h._id !== action.payload);
        });
    },
});

export const { clearError, clearLastCompletion, hideLevelUpModal } =
    habitsSlice.actions;
export default habitsSlice.reducer;
