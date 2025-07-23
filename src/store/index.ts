import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import habitReducer from './slices/habitSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['habits/setHabits', 'habits/addHabit', 'habits/updateHabit'],
        ignoredPaths: ['habits.habits', 'user.profile'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;