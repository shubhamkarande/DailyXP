const mongoose = require('mongoose');

// Achievement definitions
const ACHIEVEMENTS = {
    // Streak achievements
    STREAK_3: {
        id: 'streak_3',
        title: 'Hot Start',
        description: 'Maintain a 3-day streak',
        icon: 'local_fire_department',
        color: '#FF9F1C',
        xpReward: 25,
        requirement: { type: 'streak', value: 3 }
    },
    STREAK_7: {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'local_fire_department',
        color: '#FF6B35',
        xpReward: 50,
        requirement: { type: 'streak', value: 7 }
    },
    STREAK_14: {
        id: 'streak_14',
        title: 'Unstoppable',
        description: 'Maintain a 14-day streak',
        icon: 'whatshot',
        color: '#EF4444',
        xpReward: 100,
        requirement: { type: 'streak', value: 14 }
    },
    STREAK_30: {
        id: 'streak_30',
        title: 'Legendary Streak',
        description: 'Maintain a 30-day streak',
        icon: 'auto_awesome',
        color: '#FFD700',
        xpReward: 250,
        requirement: { type: 'streak', value: 30 }
    },

    // Completion achievements
    FIRST_HABIT: {
        id: 'first_habit',
        title: 'First Step',
        description: 'Complete your first habit',
        icon: 'emoji_events',
        color: '#4ade80',
        xpReward: 10,
        requirement: { type: 'completions', value: 1 }
    },
    COMPLETIONS_10: {
        id: 'completions_10',
        title: 'Getting Started',
        description: 'Complete 10 habits',
        icon: 'verified',
        color: '#3B82F6',
        xpReward: 30,
        requirement: { type: 'completions', value: 10 }
    },
    COMPLETIONS_50: {
        id: 'completions_50',
        title: 'Consistent',
        description: 'Complete 50 habits',
        icon: 'military_tech',
        color: '#8B5CF6',
        xpReward: 75,
        requirement: { type: 'completions', value: 50 }
    },
    COMPLETIONS_100: {
        id: 'completions_100',
        title: 'Centurion',
        description: 'Complete 100 habits',
        icon: 'workspace_premium',
        color: '#FFD700',
        xpReward: 150,
        requirement: { type: 'completions', value: 100 }
    },
    COMPLETIONS_500: {
        id: 'completions_500',
        title: 'Habit Master',
        description: 'Complete 500 habits',
        icon: 'diamond',
        color: '#EC4899',
        xpReward: 500,
        requirement: { type: 'completions', value: 500 }
    },

    // Level achievements
    LEVEL_5: {
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reach Level 5',
        icon: 'star',
        color: '#FFC107',
        xpReward: 0,
        requirement: { type: 'level', value: 5 }
    },
    LEVEL_10: {
        id: 'level_10',
        title: 'XP Hunter',
        description: 'Reach Level 10',
        icon: 'stars',
        color: '#FF9F1C',
        xpReward: 0,
        requirement: { type: 'level', value: 10 }
    },
    LEVEL_25: {
        id: 'level_25',
        title: 'Elite',
        description: 'Reach Level 25',
        icon: 'shield',
        color: '#7F13EC',
        xpReward: 0,
        requirement: { type: 'level', value: 25 }
    },
    LEVEL_50: {
        id: 'level_50',
        title: 'Legend',
        description: 'Reach Level 50',
        icon: 'emoji_events',
        color: '#FFD700',
        xpReward: 0,
        requirement: { type: 'level', value: 50 }
    },

    // Perfect day achievements
    PERFECT_DAY_1: {
        id: 'perfect_day_1',
        title: 'Perfect Day',
        description: 'Complete all habits in a day',
        icon: 'celebration',
        color: '#4ade80',
        xpReward: 20,
        requirement: { type: 'perfect_days', value: 1 }
    },
    PERFECT_DAY_7: {
        id: 'perfect_day_7',
        title: 'Perfect Week',
        description: 'Have 7 perfect days',
        icon: 'emoji_events',
        color: '#3B82F6',
        xpReward: 100,
        requirement: { type: 'perfect_days', value: 7 }
    },

    // Habit creation achievements
    HABITS_CREATE_5: {
        id: 'habits_create_5',
        title: 'Quest Builder',
        description: 'Create 5 habits',
        icon: 'add_task',
        color: '#8B5CF6',
        xpReward: 25,
        requirement: { type: 'habits_created', value: 5 }
    },

    // Early bird / night owl
    EARLY_COMPLETION: {
        id: 'early_completion',
        title: 'Early Bird',
        description: 'Complete a habit before 7 AM',
        icon: 'wb_sunny',
        color: '#FFC107',
        xpReward: 15,
        requirement: { type: 'special', value: 'early_bird' }
    },
};

const userAchievementSchema = new mongoose.Schema({
    odId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    achievementId: {
        type: String,
        required: true
    },
    unlockedAt: {
        type: Date,
        default: Date.now
    },
    xpAwarded: {
        type: Number,
        default: 0
    }
});

userAchievementSchema.index({ odId: 1, achievementId: 1 }, { unique: true });

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

/**
 * Check and unlock achievements for a user
 * @param {string} odId - User ID
 * @param {object} stats - User stats { level, totalCompletions, longestStreak, perfectDays, habitsCreated }
 * @returns {Array} - Newly unlocked achievements
 */
async function checkAchievements(odId, stats) {
    const unlockedAchievements = [];

    // Get already unlocked achievements
    const existingAchievements = await UserAchievement.find({ odId });
    const unlockedIds = existingAchievements.map(a => a.achievementId);

    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        // Skip if already unlocked
        if (unlockedIds.includes(achievement.id)) continue;

        let shouldUnlock = false;

        switch (achievement.requirement.type) {
            case 'streak':
                shouldUnlock = stats.longestStreak >= achievement.requirement.value;
                break;
            case 'completions':
                shouldUnlock = stats.totalCompletions >= achievement.requirement.value;
                break;
            case 'level':
                shouldUnlock = stats.level >= achievement.requirement.value;
                break;
            case 'perfect_days':
                shouldUnlock = stats.perfectDays >= achievement.requirement.value;
                break;
            case 'habits_created':
                shouldUnlock = stats.habitsCreated >= achievement.requirement.value;
                break;
        }

        if (shouldUnlock) {
            const newAchievement = await UserAchievement.create({
                odId,
                achievementId: achievement.id,
                xpAwarded: achievement.xpReward
            });

            unlockedAchievements.push({
                ...achievement,
                unlockedAt: newAchievement.unlockedAt
            });
        }
    }

    return unlockedAchievements;
}

/**
 * Get all achievements with user's unlock status
 * @param {string} odId - User ID
 * @returns {Array} - All achievements with unlocked status
 */
async function getAchievementsForUser(odId) {
    const userAchievements = await UserAchievement.find({ odId });
    const unlockedMap = {};

    userAchievements.forEach(ua => {
        unlockedMap[ua.achievementId] = {
            unlockedAt: ua.unlockedAt,
            xpAwarded: ua.xpAwarded
        };
    });

    return Object.entries(ACHIEVEMENTS).map(([key, achievement]) => ({
        ...achievement,
        unlocked: !!unlockedMap[achievement.id],
        unlockedAt: unlockedMap[achievement.id]?.unlockedAt || null
    }));
}

module.exports = {
    UserAchievement,
    ACHIEVEMENTS,
    checkAchievements,
    getAchievementsForUser
};
