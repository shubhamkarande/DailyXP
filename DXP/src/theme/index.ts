// DailyXP Theme Configuration
// Matches the UI design system from reference screens

export const colors = {
    // Primary colors
    primary: {
        DEFAULT: '#7f13ec',
        light: '#9f4bf7',
        dark: '#5e0eb0',
        glow: '#9f4bf2',
    },
    // Background colors
    background: {
        light: '#f7f6f8',
        dark: '#191022',
    },
    // Surface colors (cards, inputs)
    surface: {
        dark: '#261933',
        border: '#4d3267',
    },
    // Card colors
    card: {
        dark: '#2a1b38',
        light: '#ffffff',
    },
    // Accent colors
    accent: {
        gold: '#FFC107',
        green: '#4ade80',
        orange: '#FF9F1C',
        red: '#ef4444',
    },
    // Text colors
    text: {
        primary: '#ffffff',
        secondary: '#ad92c9',
        muted: '#ad92c9',
        dark: '#1f2937',
    },
    // Difficulty colors
    difficulty: {
        easy: '#4ade80',
        medium: '#fbbf24',
        hard: '#ef4444',
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
};

export const borderRadius = {
    sm: 8,
    DEFAULT: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    full: 9999,
};

export const fontSize = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
};

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
};

// XP and Level constants
export const xpConfig = {
    baseXp: {
        easy: 10,
        medium: 25,
        hard: 50,
    },
    levelXpMultiplier: 1.2,
    baseLevelXp: 100,
};

// Difficulty labels and colors
export const difficultyConfig = {
    easy: {
        label: 'Easy',
        color: colors.difficulty.easy,
        bgColor: 'rgba(74, 222, 128, 0.2)',
        xp: 10,
    },
    medium: {
        label: 'Medium',
        color: colors.difficulty.medium,
        bgColor: 'rgba(251, 191, 36, 0.2)',
        xp: 25,
    },
    hard: {
        label: 'Hard',
        color: colors.difficulty.hard,
        bgColor: 'rgba(239, 68, 68, 0.2)',
        xp: 50,
    },
};

export default {
    colors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    xpConfig,
    difficultyConfig,
};
