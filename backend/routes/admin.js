const express = require('express');
const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, admin);

/**
 * GET /admin/stats
 * Get overall platform statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalHabits = await Habit.countDocuments();
        const totalCompletions = await HabitLog.countDocuments({ completed: true });

        // Get users by level distribution
        const levelDistribution = await User.aggregate([
            {
                $group: {
                    _id: '$level',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get signups in last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentSignups = await User.countDocuments({
            createdAt: { $gte: weekAgo }
        });

        // Get completions in last 7 days
        const recentCompletions = await HabitLog.countDocuments({
            date: { $gte: weekAgo },
            completed: true
        });

        // Top habits by completions
        const topHabits = await Habit.find()
            .sort({ totalCompletions: -1 })
            .limit(10)
            .select('title totalCompletions difficulty');

        res.json({
            overview: {
                totalUsers,
                totalHabits,
                totalCompletions,
                recentSignups,
                recentCompletions
            },
            levelDistribution,
            topHabits
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

/**
 * GET /admin/users
 * Get all users (paginated)
 */
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * PUT /admin/users/:id
 * Update user (adjust level/xp, change role)
 */
router.put('/users/:id', async (req, res) => {
    try {
        const { level, xp, role } = req.body;

        const updateData = {};
        if (level !== undefined) updateData.level = level;
        if (xp !== undefined) updateData.xp = xp;
        if (role !== undefined) updateData.role = role;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated', user });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

module.exports = router;
