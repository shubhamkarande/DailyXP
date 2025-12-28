import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import habitsReducer from './habitsSlice';
import progressReducer from './progressSlice';
import achievementsReducer from './achievementsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        habits: habitsReducer,
        progress: progressReducer,
        achievements: achievementsReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
