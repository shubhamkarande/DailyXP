import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import habitsSlice from './slices/habitsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    habits: habitsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;