/**
 * Streak Logic for DailyXP
 * 
 * Handles streak calculation, decay, and grace period rules
 */

// Grace period in hours (allows completing habit up to X hours late)
const GRACE_PERIOD_HOURS = 4;

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return (
        checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
    );
}

/**
 * Check if a date is yesterday
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const checkDate = new Date(date);
    return (
        checkDate.getDate() === yesterday.getDate() &&
        checkDate.getMonth() === yesterday.getMonth() &&
        checkDate.getFullYear() === yesterday.getFullYear()
    );
}

/**
 * Check if completion is within grace period
 * @param {Date} lastCompleted - Last completion date
 * @returns {boolean}
 */
function isWithinGracePeriod(lastCompleted) {
    if (!lastCompleted) return false;

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const graceDeadline = new Date(yesterday);
    graceDeadline.setHours(graceDeadline.getHours() + GRACE_PERIOD_HOURS);

    // If last completed was yesterday and we're within grace period
    if (isYesterday(lastCompleted) && now <= graceDeadline) {
        return true;
    }

    return false;
}

/**
 * Calculate new streak value based on last completion
 * @param {number} currentStreak - Current streak count
 * @param {Date|null} lastCompletedAt - Last completion timestamp
 * @param {string} frequency - 'daily' or 'weekly'
 * @returns {object} - { newStreak, streakBroken, isNewStreak }
 */
function calculateStreak(currentStreak, lastCompletedAt, frequency = 'daily') {
    if (!lastCompletedAt) {
        // First completion
        return {
            newStreak: 1,
            streakBroken: false,
            isNewStreak: true
        };
    }

    const now = new Date();
    const lastCompleted = new Date(lastCompletedAt);

    if (frequency === 'daily') {
        // Already completed today - no change
        if (isToday(lastCompleted)) {
            return {
                newStreak: currentStreak,
                streakBroken: false,
                isNewStreak: false
            };
        }

        // Completed yesterday - streak continues
        if (isYesterday(lastCompleted)) {
            return {
                newStreak: currentStreak + 1,
                streakBroken: false,
                isNewStreak: false
            };
        }

        // Within grace period - streak continues
        if (isWithinGracePeriod(lastCompleted)) {
            return {
                newStreak: currentStreak + 1,
                streakBroken: false,
                isNewStreak: false
            };
        }

        // Streak broken - start fresh
        return {
            newStreak: 1,
            streakBroken: true,
            isNewStreak: true
        };
    }

    if (frequency === 'weekly') {
        const daysDiff = Math.floor((now - lastCompleted) / (1000 * 60 * 60 * 24));

        // Within the same week
        if (daysDiff < 7) {
            return {
                newStreak: currentStreak,
                streakBroken: false,
                isNewStreak: false
            };
        }

        // Exactly one week apart (with 1-day grace)
        if (daysDiff <= 8) {
            return {
                newStreak: currentStreak + 1,
                streakBroken: false,
                isNewStreak: false
            };
        }

        // Streak broken
        return {
            newStreak: 1,
            streakBroken: true,
            isNewStreak: true
        };
    }

    return {
        newStreak: 1,
        streakBroken: true,
        isNewStreak: true
    };
}

/**
 * Get streak status for display
 * @param {number} streak - Current streak
 * @returns {object} - { label, color, isFire }
 */
function getStreakStatus(streak) {
    if (streak >= 30) {
        return { label: 'Legendary', color: '#FFD700', isFire: true };
    }
    if (streak >= 14) {
        return { label: 'On Fire', color: '#FF6B35', isFire: true };
    }
    if (streak >= 7) {
        return { label: 'Hot', color: '#FF9F1C', isFire: true };
    }
    if (streak >= 3) {
        return { label: 'Building', color: '#4ECDC4', isFire: false };
    }
    if (streak >= 1) {
        return { label: 'Started', color: '#7f13ec', isFire: false };
    }
    return { label: 'New', color: '#6B7280', isFire: false };
}

/**
 * Check if habit is at risk (not completed today, might break streak)
 * @param {Date|null} lastCompletedAt - Last completion timestamp
 * @param {string} frequency - 'daily' or 'weekly'
 * @returns {boolean}
 */
function isStreakAtRisk(lastCompletedAt, frequency = 'daily') {
    if (!lastCompletedAt) return false;

    const now = new Date();
    const lastCompleted = new Date(lastCompletedAt);

    if (frequency === 'daily') {
        // If not completed today, streak is at risk
        return !isToday(lastCompleted);
    }

    if (frequency === 'weekly') {
        const daysDiff = Math.floor((now - lastCompleted) / (1000 * 60 * 60 * 24));
        return daysDiff >= 6; // At risk if 6+ days since last completion
    }

    return false;
}

module.exports = {
    calculateStreak,
    getStreakStatus,
    isStreakAtRisk,
    isToday,
    isYesterday,
    isWithinGracePeriod,
    GRACE_PERIOD_HOURS
};
