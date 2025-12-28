const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Habit = require('../models/Habit');

const router = express.Router();

// Default starter habits for each focus area
const STARTER_HABITS = {
    health: [
        { title: 'Drink 8 glasses of water', icon: 'water_drop', difficulty: 'easy' },
        { title: 'Exercise for 30 minutes', icon: 'fitness_center', difficulty: 'medium' },
        { title: 'Sleep 8 hours', icon: 'bedtime', difficulty: 'medium' }
    ],
    learning: [
        { title: 'Read for 20 minutes', icon: 'menu_book', difficulty: 'medium' },
        { title: 'Learn a new word', icon: 'school', difficulty: 'easy' },
        { title: 'Practice a new skill', icon: 'psychology', difficulty: 'hard' }
    ],
    productivity: [
        { title: 'Plan your day', icon: 'checklist', difficulty: 'easy' },
        { title: 'Deep work session (1 hour)', icon: 'terminal', difficulty: 'hard' },
        { title: 'Review and reflect', icon: 'edit_note', difficulty: 'easy' }
    ]
};

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, focusAreas } = req.body;

        // Validate input
        if (!email || !password || !username) {
            return res.status(400).json({
                error: 'Email, password, and username are required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            username,
            focusAreas: focusAreas || []
        });

        // Create starter habits based on focus areas
        if (focusAreas && focusAreas.length > 0) {
            const habitsToCreate = [];

            for (const area of focusAreas) {
                const areaHabits = STARTER_HABITS[area] || [];
                for (const habit of areaHabits) {
                    habitsToCreate.push({
                        userId: user._id,
                        title: habit.title,
                        icon: habit.icon,
                        difficulty: habit.difficulty,
                        frequency: 'daily',
                        focusArea: area
                    });
                }
            }

            if (habitsToCreate.length > 0) {
                await Habit.insertMany(habitsToCreate);
            }
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                level: user.level,
                xp: user.xp,
                focusAreas: user.focusAreas
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * POST /auth/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                level: user.level,
                xp: user.xp,
                focusAreas: user.focusAreas,
                totalXpEarned: user.totalXpEarned
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * POST /auth/guest
 * Create a guest account (local-only mode)
 */
router.post('/guest', async (req, res) => {
    try {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const user = await User.create({
            email: `${guestId}@guest.dailyxp`,
            password: guestId,
            username: 'Guest User',
            isGuest: true,
            focusAreas: []
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Guest account created',
            token,
            user: {
                id: user._id,
                username: user.username,
                level: user.level,
                xp: user.xp,
                isGuest: true
            }
        });
    } catch (error) {
        console.error('Guest creation error:', error);
        res.status(500).json({ error: 'Failed to create guest account' });
    }
});

/**
 * GET /auth/me
 * Get current user info
 */
const { auth } = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                level: user.level,
                xp: user.xp,
                totalXpEarned: user.totalXpEarned,
                focusAreas: user.focusAreas,
                isGuest: user.isGuest,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

module.exports = router;
