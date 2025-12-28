/**
 * XP Calculator for DailyXP
 * 
 * XP Formula: baseXP × difficultyMultiplier × streakMultiplier
 */

// Base XP values for each difficulty
const BASE_XP = {
    easy: 10,
    medium: 25,
    hard: 50
};

// Difficulty multipliers
const DIFFICULTY_MULTIPLIER = {
    easy: 1.0,
    medium: 1.0,
    hard: 1.0
};

/**
 * Calculate streak multiplier based on current streak
 * Multiplier increases every 7 days
 * @param {number} streak - Current streak count
 * @returns {number} - Streak multiplier (1.0 - 2.0)
 */
function getStreakMultiplier(streak) {
    if (streak < 7) return 1.0;
    if (streak < 14) return 1.1;
    if (streak < 21) return 1.2;
    if (streak < 28) return 1.3;
    if (streak < 35) return 1.4;
    if (streak < 42) return 1.5;
    if (streak < 49) return 1.6;
    if (streak < 56) return 1.7;
    if (streak < 63) return 1.8;
    if (streak < 70) return 1.9;
    return 2.0; // Max multiplier at 70+ days
}

/**
 * Calculate XP earned for completing a habit
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @param {number} streak - Current streak count
 * @returns {object} - { xp, baseXp, streakMultiplier, streakBonus }
 */
function calculateXp(difficulty, streak = 0) {
    const baseXp = BASE_XP[difficulty] || BASE_XP.medium;
    const difficultyMult = DIFFICULTY_MULTIPLIER[difficulty] || 1.0;
    const streakMult = getStreakMultiplier(streak);

    const rawXp = baseXp * difficultyMult * streakMult;
    const xp = Math.round(rawXp);
    const streakBonus = xp - baseXp;

    return {
        xp,
        baseXp,
        streakMultiplier: streakMult,
        streakBonus: streakBonus > 0 ? streakBonus : 0
    };
}

/**
 * Calculate XP needed to reach a specific level
 * @param {number} level - Target level
 * @returns {number} - XP needed
 */
function getXpForLevel(level) {
    // XP grows exponentially: 100 * level * 1.2
    return Math.floor(100 * level * 1.2);
}

/**
 * Calculate total XP needed to reach a level from level 1
 * @param {number} targetLevel - Target level
 * @returns {number} - Total cumulative XP needed
 */
function getTotalXpForLevel(targetLevel) {
    let total = 0;
    for (let lvl = 1; lvl < targetLevel; lvl++) {
        total += getXpForLevel(lvl);
    }
    return total;
}

/**
 * Calculate level from total XP
 * @param {number} totalXp - Total XP earned
 * @returns {object} - { level, currentXp, xpForNextLevel, progress }
 */
function getLevelFromXp(totalXp) {
    let level = 1;
    let remainingXp = totalXp;

    while (remainingXp >= getXpForLevel(level)) {
        remainingXp -= getXpForLevel(level);
        level++;
    }

    const xpForNextLevel = getXpForLevel(level);
    const progress = remainingXp / xpForNextLevel;

    return {
        level,
        currentXp: remainingXp,
        xpForNextLevel,
        progress: Math.round(progress * 100)
    };
}

/**
 * Calculate bonus XP for "Perfect Day" (all habits completed)
 * @param {number} habitCount - Number of habits completed
 * @returns {number} - Bonus XP
 */
function getPerfectDayBonus(habitCount) {
    if (habitCount < 2) return 0;
    return Math.min(habitCount * 5, 50); // 5 XP per habit, max 50
}

module.exports = {
    calculateXp,
    getXpForLevel,
    getTotalXpForLevel,
    getLevelFromXp,
    getStreakMultiplier,
    getPerfectDayBonus,
    BASE_XP
};
