const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: true
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    streakAtCompletion: {
        type: Number,
        default: 0
    },
    streakMultiplier: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient date range queries
habitLogSchema.index({ habitId: 1, date: 1 });
habitLogSchema.index({ userId: 1, date: -1 });
habitLogSchema.index({ userId: 1, date: 1, completed: 1 });

// Virtual for formatted date
habitLogSchema.virtual('dateString').get(function () {
    return this.date.toISOString().split('T')[0];
});

module.exports = mongoose.model('HabitLog', habitLogSchema);
