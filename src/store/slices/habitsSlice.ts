import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit } from '../../types';

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  isLoading: false,
  error: null,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.habits.push(action.payload);
    },
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const index = state.habits.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    },
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(h => h.id !== action.payload);
    },
    completeHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(h => h.id === action.payload);
      if (habit && !habit.isCompleted) {
        habit.isCompleted = true;
        habit.streak += 1;
        habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
        habit.completionHistory.push(new Date());
        habit.lastCompleted = new Date();
      }
    },
    resetDailyHabits: (state) => {
      state.habits.forEach(habit => {
        habit.isCompleted = false;
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  resetDailyHabits,
  setLoading,
  setError,
} = habitsSlice.actions;

export default habitsSlice.reducer;