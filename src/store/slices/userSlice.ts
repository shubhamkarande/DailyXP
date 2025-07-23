import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, XPReward } from '../../types';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const calculateLevel = (totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number } => {
  const level = Math.floor(totalXP / 100) + 1;
  const currentLevelXP = totalXP % 100;
  const nextLevelXP = 100;
  return { level, currentLevelXP, nextLevelXP };
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
      state.isLoading = false;
    },
    addXP: (state, action: PayloadAction<number>) => {
      if (state.profile) {
        const oldLevel = state.profile.level;
        state.profile.totalXP += action.payload;
        const { level, currentLevelXP, nextLevelXP } = calculateLevel(state.profile.totalXP);
        state.profile.level = level;
        state.profile.currentLevelXP = currentLevelXP;
        state.profile.nextLevelXP = nextLevelXP;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUserProfile, addXP, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;