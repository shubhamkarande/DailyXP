const express = require('express');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { calculateXp } = require('../utils/xpCalculator');
const { calculateStreak, isToday } = require('../utils/streakLogic');

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * GET /habits
 * Get all habits for current user
 */
router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find({
            userId: req.userId,
            isActive: true
        }).sort({ createdAt: -1 });

        // Add completion status for today
        const habitsWithStatus = habits.map(habit => {
            const habitObj = habit.toObject();
            habitObj.completedToday = habit.isCompletedToday();
            return habitObj;
        });

        res.json({ habits: habitsWithStatus });
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({ error: 'Failed to fetch habits' });
    }
});

/**
 * GET /habits/:id
 * Get a specific habit
 */
router.get('/:id', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.json({ habit });
    } catch (error) {
        console.error('Get habit error:', error);
        res.status(500).json({ error: 'Failed to fetch habit' });
    }
});

/**
 * POST /habits
 * Create a new habit
 */
router.post('/', async (req, res) => {
    try {
        const { title, description, icon, difficulty, frequency, focusArea } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const habit = await Habit.create({
            userId: req.userId,
            title,
            description,
            icon: icon || 'check_circle',
            difficulty: difficulty || 'medium',
            frequency: frequency || 'daily',
            focusArea: focusArea || 'custom'
        });

        res.status(201).json({
            message: 'Habit created',
            habit
        });
    } catch (error) {
        console.error('Create habit error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        res.status(500).json({ error: 'Failed to create habit' });
    }
});

/**
 * PUT /habits/:id
 * Update a habit
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, description, icon, difficulty, frequency, focusArea } = req.body;

        const habit = await Habit.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, description, icon, difficulty, frequency, focusArea },
            { new: true, runValidators: true }
        );

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.json({
            message: 'Habit updated',
            habit
        });
    } catch (error) {
        console.error('Update habit error:', error);
        res.status(500).json({ error: 'Failed to update habit' });
    }
});

/**
 * DELETE /habits/:id
 * Soft delete a habit (set isActive to false)
 */
router.delete('/:id', async (req, res) => {
    try {
        const habit = await Habit.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { isActive: false },
            { new: true }
        );

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.json({ message: 'Habit deleted' });
    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({ error: 'Failed to delete habit' });
    }
});

/**
 * POST /habits/:id/complete
 * Mark a habit as completed for today
 */
router.post('/:id/complete', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Check if already completed today
        if (habit.isCompletedToday()) {
            return res.status(400).json({
                error: 'Habit already completed today',
                alreadyCompleted: true
            });
        }

        // Calculate streak
        const streakResult = calculateStreak(
            habit.currentStreak,
            habit.lastCompletedAt,
            habit.frequency
        );

        // Calculate XP
        const xpResult = calculateXp(habit.difficulty, streakResult.newStreak);

        // Update habit
        habit.currentStreak = streakResult.newStreak;
        habit.longestStreak = Math.max(habit.longestStreak, streakResult.newStreak);
        habit.lastCompletedAt = new Date();
        habit.totalCompletions += 1;
        habit.totalXpEarned += xpResult.xp;
        await habit.save();

        // Create habit log
        await HabitLog.create({
            habitId: habit._id,
            userId: req.userId,
            date: new Date(),
            completed: true,
            xpEarned: xpResult.xp,
            streakAtCompletion: streakResult.newStreak,
            streakMultiplier: xpResult.streakMultiplier
        });

        // Update user XP and check for level up
        const user = await User.findById(req.userId);
        user.xp += xpResult.xp;
        user.totalXpEarned += xpResult.xp;

        let leveledUp = false;
        const previousLevel = user.level;

        while (user.checkLevelUp()) {
            leveledUp = true;
        }

        await user.save();

        res.json({
            message: 'Habit completed!',
            xpEarned: xpResult.xp,
            baseXp: xpResult.baseXp,
            streakBonus: xpResult.streakBonus,
            streakMultiplier: xpResult.streakMultiplier,
            newStreak: streakResult.newStreak,
            streakBroken: streakResult.streakBroken,
            leveledUp,
            previousLevel,
            newLevel: user.level,
            currentXp: user.xp,
            xpForNextLevel: user.getXpForNextLevel(),
            totalXpEarned: user.totalXpEarned
        });
    } catch (error) {
        console.error('Complete habit error:', error);
        res.status(500).json({ error: 'Failed to complete habit' });
    }
});

/**
 * POST /habits/:id/uncomplete
 * Undo completion for today (in case of mistake)
 */
router.post('/:id/uncomplete', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Find today's log
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const log = await HabitLog.findOne({
            habitId: habit._id,
            userId: req.userId,
            date: { $gte: today, $lt: tomorrow }
        });

        if (!log) {
            return res.status(400).json({ error: 'No completion found for today' });
        }

        // Revert user XP
        const user = await User.findById(req.userId);
        user.xp = Math.max(0, user.xp - log.xpEarned);
        user.totalXpEarned = Math.max(0, user.totalXpEarned - log.xpEarned);
        await user.save();

        // Revert habit stats
        habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
        habit.totalXpEarned = Math.max(0, habit.totalXpEarned - log.xpEarned);
        habit.currentStreak = Math.max(0, habit.currentStreak - 1);
        habit.lastCompletedAt = null;
        await habit.save();

        // Delete log
        await log.deleteOne();

        res.json({ message: 'Completion undone' });
    } catch (error) {
        console.error('Uncomplete habit error:', error);
        res.status(500).json({ error: 'Failed to undo completion' });
    }
});

module.exports = router;
