import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUserXP: (state, action: PayloadAction<{ xp: number; level: number }>) => {
      if (state.user) {
        state.user.totalXP = action.payload.xp;
        state.user.level = action.payload.level;
        state.user.currentLevelXP = action.payload.xp % 100;
        state.user.nextLevelXP = 100;
      }
    },
    addAchievement: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user.achievements = state.user.achievements || [];
        state.user.achievements.push(action.payload);
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<any>>) => {
      if (state.user) {
        state.user.preferences = { ...state.user.preferences, ...action.payload };
      }
    },
  },
});

export const { setUser, setLoading, updateUserXP, addAchievement, updatePreferences } = authSlice.actions;
export default authSlice.reducer;