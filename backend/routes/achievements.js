const express = require('express');
const { auth } = require('../middleware/auth');
const { getAchievementsForUser, checkAchievements, ACHIEVEMENTS } = require('../models/Achievement');
const Habit = require('../models/Habit');
const User = require('../models/User');

const router = express.Router();

router.use(auth);

/**
 * GET /achievements
 * Get all achievements with user's unlock status
 */
router.get('/', async (req, res) => {
    try {
        const achievements = await getAchievementsForUser(req.userId);

        // Sort: unlocked first, then by requirement value
        achievements.sort((a, b) => {
            if (a.unlocked && !b.unlocked) return -1;
            if (!a.unlocked && b.unlocked) return 1;
            return a.requirement.value - b.requirement.value;
        });

        const unlocked = achievements.filter(a => a.unlocked).length;
        const total = achievements.length;

        res.json({
            achievements,
            stats: {
                unlocked,
                total,
                progress: Math.round((unlocked / total) * 100)
            }
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

/**
 * POST /achievements/check
 * Manually check for new achievements
 */
router.post('/check', async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const habits = await Habit.find({ userId: req.userId, isActive: true });

        const stats = {
            level: user.level,
            totalCompletions: habits.reduce((sum, h) => sum + h.totalCompletions, 0),
            longestStreak: Math.max(...habits.map(h => h.longestStreak), 0),
            perfectDays: 0, // Would need to calculate from logs
            habitsCreated: habits.length
        };

        const newAchievements = await checkAchievements(req.userId, stats);

        // Award XP for new achievements
        let xpEarned = 0;
        for (const achievement of newAchievements) {
            xpEarned += achievement.xpReward;
        }

        if (xpEarned > 0) {
            user.xp += xpEarned;
            user.totalXpEarned += xpEarned;
            while (user.checkLevelUp()) { }
            await user.save();
        }

        res.json({
            newAchievements,
            xpEarned,
            currentLevel: user.level,
            currentXp: user.xp
        });
    } catch (error) {
        console.error('Check achievements error:', error);
        res.status(500).json({ error: 'Failed to check achievements' });
    }
});

/**
 * GET /achievements/recent
 * Get recently unlocked achievements
 */
router.get('/recent', async (req, res) => {
    try {
        const achievements = await getAchievementsForUser(req.userId);

        const recent = achievements
            .filter(a => a.unlocked)
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unnockedAt))
            .slice(0, 5);

        res.json({ achievements: recent });
    } catch (error) {
        console.error('Get recent achievements error:', error);
        res.status(500).json({ error: 'Failed to fetch recent achievements' });
    }
});

module.exports = router;
