const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Habit title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: 'check_circle'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily'
    },
    focusArea: {
        type: String,
        enum: ['health', 'learning', 'productivity', 'custom'],
        default: 'custom'
    },
    // Streak tracking
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastCompletedAt: {
        type: Date,
        default: null
    },
    // Stats
    totalCompletions: {
        type: Number,
        default: 0
    },
    totalXpEarned: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Get base XP based on difficulty
habitSchema.methods.getBaseXp = function () {
    const xpMap = {
        easy: 10,
        medium: 25,
        hard: 50
    };
    return xpMap[this.difficulty] || 25;
};

// Check if habit was completed today
habitSchema.methods.isCompletedToday = function () {
    if (!this.lastCompletedAt) return false;
    const today = new Date();
    const lastCompleted = new Date(this.lastCompletedAt);
    return (
        lastCompleted.getDate() === today.getDate() &&
        lastCompleted.getMonth() === today.getMonth() &&
        lastCompleted.getFullYear() === today.getFullYear()
    );
};

// Index for efficient queries
habitSchema.index({ userId: 1, isActive: 1 });
habitSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Habit', habitSchema);
