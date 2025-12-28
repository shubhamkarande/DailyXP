const express = require('express');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { getLevelFromXp, getPerfectDayBonus } = require('../utils/xpCalculator');

const router = express.Router();

router.use(auth);

/**
 * GET /progress/summary
 * Get user's progress summary
 */
router.get('/summary', async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const habits = await Habit.find({ userId: req.userId, isActive: true });

        // Get today's completions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayLogs = await HabitLog.find({
            userId: req.userId,
            date: { $gte: today, $lt: tomorrow },
            completed: true
        });

        const todayXp = todayLogs.reduce((sum, log) => sum + log.xpEarned, 0);
        const completedToday = todayLogs.length;
        const totalHabits = habits.length;

        // Calculate level progress
        const levelInfo = getLevelFromXp(user.totalXpEarned);

        // Check for perfect day
        const isPerfectDay = totalHabits > 0 && completedToday === totalHabits;

        res.json({
            user: {
                username: user.username,
                level: user.level,
                xp: user.xp,
                xpForNextLevel: user.getXpForNextLevel(),
                totalXpEarned: user.totalXpEarned,
                progress: levelInfo.progress
            },
            today: {
                completedHabits: completedToday,
                totalHabits,
                xpEarned: todayXp,
                isPerfectDay
            },
            stats: {
                totalCompletions: habits.reduce((sum, h) => sum + h.totalCompletions, 0),
                longestStreak: Math.max(...habits.map(h => h.longestStreak), 0),
                activeHabits: totalHabits
            }
        });
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

/**
 * GET /progress/streaks
 * Get streak information for all habits
 */
router.get('/streaks', async (req, res) => {
    try {
        const habits = await Habit.find({
            userId: req.userId,
            isActive: true
        }).select('title icon currentStreak longestStreak lastCompletedAt difficulty');

        const streaks = habits.map(habit => ({
            habitId: habit._id,
            title: habit.title,
            icon: habit.icon,
            currentStreak: habit.currentStreak,
            longestStreak: habit.longestStreak,
            lastCompletedAt: habit.lastCompletedAt,
            completedToday: habit.isCompletedToday()
        }));

        // Sort by current streak (highest first)
        streaks.sort((a, b) => b.currentStreak - a.currentStreak);

        res.json({ streaks });
    } catch (error) {
        console.error('Get streaks error:', error);
        res.status(500).json({ error: 'Failed to fetch streaks' });
    }
});

/**
 * GET /progress/history
 * Get completion history for the last N days
 */
router.get('/history', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const logs = await HabitLog.find({
            userId: req.userId,
            date: { $gte: startDate },
            completed: true
        }).populate('habitId', 'title icon difficulty');

        // Group by date
        const history = {};

        logs.forEach(log => {
            const dateStr = log.date.toISOString().split('T')[0];
            if (!history[dateStr]) {
                history[dateStr] = {
                    date: dateStr,
                    completions: [],
                    totalXp: 0
                };
            }
            history[dateStr].completions.push({
                habitId: log.habitId._id,
                title: log.habitId.title,
                icon: log.habitId.icon,
                xpEarned: log.xpEarned
            });
            history[dateStr].totalXp += log.xpEarned;
        });

        // Convert to array and sort by date (newest first)
        const historyArray = Object.values(history).sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        res.json({ history: historyArray });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

/**
 * GET /progress/chart
 * Get XP data for charts (last 7/30 days)
 */
router.get('/chart', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const chartData = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const logs = await HabitLog.find({
                userId: req.userId,
                date: { $gte: date, $lt: nextDate },
                completed: true
            });

            const totalXp = logs.reduce((sum, log) => sum + log.xpEarned, 0);
            const completions = logs.length;

            chartData.push({
                date: date.toISOString().split('T')[0],
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                xp: totalXp,
                completions
            });
        }

        res.json({ chartData });
    } catch (error) {
        console.error('Get chart data error:', error);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
});

module.exports = router;
