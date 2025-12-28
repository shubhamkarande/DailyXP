export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Auth exports
export {
    loadStoredAuth,
    register,
    login,
    loginAsGuest,
    logout,
    clearError as clearAuthError,
    setOnboardingComplete,
    updateUserXp,
} from './authSlice';

// Habits exports
export {
    fetchHabits,
    createHabit,
    completeHabit,
    deleteHabit,
    clearError as clearHabitsError,
    clearLastCompletion,
    hideLevelUpModal,
} from './habitsSlice';
export type { Habit } from './habitsSlice';

// Progress exports
export {
    fetchSummary,
    fetchStreaks,
    fetchChartData,
    clearError as clearProgressError,
    updateTodayStats,
} from './progressSlice';

// Achievements exports
export {
    fetchAchievements,
    checkAchievements,
    clearError as clearAchievementsError,
    addRecentUnlock,
    clearRecentUnlocks,
} from './achievementsSlice';
