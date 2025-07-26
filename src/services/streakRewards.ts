import { StreakReward, Habit } from '../types';

export const STREAK_REWARDS: StreakReward[] = [
  {
    streakLength: 3,
    xpBonus: 25,
    title: 'Getting Started',
    description: 'Completed a habit for 3 days in a row',
    icon: '🔥',
  },
  {
    streakLength: 7,
    xpBonus: 50,
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '⚡',
  },
  {
    streakLength: 14,
    xpBonus: 100,
    title: 'Two Week Champion',
    description: 'Kept going for 14 days straight',
    icon: '🌟',
  },
  {
    streakLength: 21,
    xpBonus: 150,
    title: 'Habit Former',
    description: '21 days - they say this is when habits stick!',
    icon: '💪',
  },
  {
    streakLength: 30,
    xpBonus: 200,
    title: 'Monthly Master',
    description: 'A full month of consistency',
    icon: '👑',
  },
  {
    streakLength: 50,
    xpBonus: 300,
    title: 'Halfway Hero',
    description: '50 days of dedication',
    icon: '🦸',
  },
  {
    streakLength: 75,
    xpBonus: 400,
    title: 'Persistence Pro',
    description: '75 days of unwavering commitment',
    icon: '🎯',
  },
  {
    streakLength: 100,
    xpBonus: 500,
    title: 'Century Club',
    description: '100 days! You are unstoppable!',
    icon: '💎',
  },
  {
    streakLength: 150,
    xpBonus: 750,
    title: 'Legendary Streak',
    description: '150 days of pure dedication',
    icon: '🏆',
  },
  {
    streakLength: 200,
    xpBonus: 1000,
    title: 'Habit Master',
    description: '200 days! You have mastered this habit',
    icon: '🥇',
  },
  {
    streakLength: 365,
    xpBonus: 2000,
    title: 'Year-Long Legend',
    description: 'A full year of consistency - incredible!',
    icon: '🌟',
  },
];

export class StreakRewardService {
  static getRewardForStreak(streakLength: number): StreakReward | null {
    return STREAK_REWARDS.find(reward => reward.streakLength === streakLength) || null;
  }

  static getNextReward(currentStreak: number): StreakReward | null {
    return STREAK_REWARDS.find(reward => reward.streakLength > currentStreak) || null;
  }

  static getAllEarnedRewards(habit: Habit): StreakReward[] {
    return STREAK_REWARDS.filter(reward => habit.bestStreak >= reward.streakLength);
  }

  static calculateStreakBonus(habit: Habit): number {
    const earnedRewards = this.getAllEarnedRewards(habit);
    return earnedRewards.reduce((total, reward) => total + reward.xpBonus, 0);
  }

  static getStreakMultiplier(streakLength: number): number {
    if (streakLength >= 100) return 3.0;
    if (streakLength >= 50) return 2.5;
    if (streakLength >= 30) return 2.0;
    if (streakLength >= 14) return 1.5;
    if (streakLength >= 7) return 1.25;
    if (streakLength >= 3) return 1.1;
    return 1.0;
  }

  static getStreakInsights(habits: Habit[]): {
    totalStreakDays: number;
    averageStreak: number;
    longestStreak: number;
    activeStreaks: number;
    streakBreaks: number;
    consistencyScore: number;
  } {
    const totalStreakDays = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const averageStreak = habits.length > 0 ? Math.round(totalStreakDays / habits.length) : 0;
    const longestStreak = Math.max(...habits.map(h => h.bestStreak), 0);
    const activeStreaks = habits.filter(h => h.streak > 0).length;
    
    // Calculate streak breaks (times when streak was reset)
    const streakBreaks = habits.reduce((sum, habit) => {
      const completions = habit.completionHistory.length;
      const bestStreak = habit.bestStreak;
      const currentStreak = habit.streak;
      
      // Estimate breaks based on completion history vs best streak
      if (completions > bestStreak && bestStreak > 0) {
        return sum + Math.floor(completions / bestStreak) - 1;
      }
      return sum;
    }, 0);

    // Consistency score (0-100) based on active streaks vs total habits
    const consistencyScore = habits.length > 0 
      ? Math.round((activeStreaks / habits.length) * 100)
      : 0;

    return {
      totalStreakDays,
      averageStreak,
      longestStreak,
      activeStreaks,
      streakBreaks,
      consistencyScore,
    };
  }

  static getMotivationalMessage(habit: Habit): string {
    const streak = habit.streak;
    const nextReward = this.getNextReward(streak);

    if (streak === 0) {
      return `Start your ${habit.title} journey today! 🚀`;
    }

    if (nextReward) {
      const daysToNext = nextReward.streakLength - streak;
      if (daysToNext === 1) {
        return `One more day to unlock "${nextReward.title}"! 🎯`;
      } else if (daysToNext <= 3) {
        return `Only ${daysToNext} days until "${nextReward.title}"! 💪`;
      } else {
        return `${daysToNext} days to "${nextReward.title}" - keep going! ⚡`;
      }
    }

    // For very high streaks beyond our rewards
    if (streak >= 365) {
      return `${streak} days! You're a true habit legend! 🌟`;
    }

    return `${streak} day streak! You're doing amazing! 🔥`;
  }

  static getStreakEmoji(streakLength: number): string {
    if (streakLength >= 365) return '🌟';
    if (streakLength >= 200) return '🥇';
    if (streakLength >= 100) return '💎';
    if (streakLength >= 50) return '🦸';
    if (streakLength >= 30) return '👑';
    if (streakLength >= 21) return '💪';
    if (streakLength >= 14) return '🌟';
    if (streakLength >= 7) return '⚡';
    if (streakLength >= 3) return '🔥';
    return '✨';
  }

  static shouldCelebrateStreak(streakLength: number): boolean {
    return STREAK_REWARDS.some(reward => reward.streakLength === streakLength);
  }

  static getStreakCelebrationData(streakLength: number): {
    title: string;
    message: string;
    emoji: string;
    xpBonus: number;
  } | null {
    const reward = this.getRewardForStreak(streakLength);
    
    if (!reward) return null;

    return {
      title: reward.title,
      message: reward.description,
      emoji: reward.icon,
      xpBonus: reward.xpBonus,
    };
  }
}