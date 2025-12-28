const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [2, 'Username must be at least 2 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    totalXpEarned: {
        type: Number,
        default: 0
    },
    focusAreas: [{
        type: String,
        enum: ['health', 'learning', 'productivity']
    }],
    isGuest: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate XP needed for next level
userSchema.methods.getXpForNextLevel = function () {
    // XP formula: 100 * level * 1.2 (exponential growth)
    return Math.floor(100 * this.level * 1.2);
};

// Check if user should level up
userSchema.methods.checkLevelUp = function () {
    const xpNeeded = this.getXpForNextLevel();
    if (this.xp >= xpNeeded) {
        this.xp -= xpNeeded;
        this.level += 1;
        return true;
    }
    return false;
};

module.exports = mongoose.model('User', userSchema);
