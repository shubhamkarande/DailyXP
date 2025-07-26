import { Achievement, User, Habit } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Getting Started',
    description: 'Complete a habit for 3 days in a row',
    icon: '🔥',
    xpReward: 50,
    isUnlocked: false,
    category: 'streak',
    requirement: 3,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    xpReward: 100,
    isUnlocked: false,
    category: 'streak',
    requirement: 7,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Keep a habit going for 30 days',
    icon: '👑',
    xpReward: 300,
    isUnlocked: false,
    category: 'streak',
    requirement: 30,
  },
  {
    id: 'streak_100',
    title: 'Century Club',
    description: 'Achieve a 100-day streak',
    icon: '💎',
    xpReward: 1000,
    isUnlocked: false,
    category: 'streak',
    requirement: 100,
  },

  // Completion Achievements
  {
    id: 'complete_10',
    title: 'Habit Novice',
    description: 'Complete 10 habits total',
    icon: '🌱',
    xpReward: 25,
    isUnlocked: false,
    category: 'completion',
    requirement: 10,
  },
  {
    id: 'complete_50',
    title: 'Habit Enthusiast',
    description: 'Complete 50 habits total',
    icon: '🌿',
    xpReward: 100,
    isUnlocked: false,
    category: 'completion',
    requirement: 50,
  },
  {
    id: 'complete_100',
    title: 'Habit Expert',
    description: 'Complete 100 habits total',
    icon: '🌳',
    xpReward: 200,
    isUnlocked: false,
    category: 'completion',
    requirement: 100,
  },

  // Level Achievements
  {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    xpReward: 75,
    isUnlocked: false,
    category: 'level',
    requirement: 5,
  },
  {
    id: 'level_10',
    title: 'Habit Hero',
    description: 'Reach level 10',
    icon: '🦸',
    xpReward: 150,
    isUnlocked: false,
    category: 'level',
    requirement: 10,
  },
  {
    id: 'level_25',
    title: 'Legendary',
    description: 'Reach level 25',
    icon: '🏆',
    xpReward: 500,
    isUnlocked: false,
    category: 'level',
    requirement: 25,
  },

  // Special Achievements
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete all habits for 7 consecutive days',
    icon: '✨',
    xpReward: 200,
    isUnlocked: false,
    category: 'special',
    requirement: 7,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a habit before 8 AM',
    icon: '🐦',
    xpReward: 30,
    isUnlocked: false,
    category: 'special',
    requirement: 1,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    icon: '🦉',
    xpReward: 30,
    isUnlocked: false,
    category: 'special',
    requirement: 1,
  },
];

export class AchievementService {
  static checkAchievements(user: User, habits: Habit[]): Achievement[] {
    const newAchievements: Achievement[] = [];
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completionHistory.length, 0);
    const maxStreak = Math.max(...habits.map(habit => habit.bestStreak));

    ACHIEVEMENTS.forEach(achievement => {
      const userAchievement = user.achievements.find(a => a.id === achievement.id);
      
      if (userAchievement?.isUnlocked) return;

      let shouldUnlock = false;

      switch (achievement.category) {
        case 'streak':
          shouldUnlock = maxStreak >= achievement.requirement;
          break;
        case 'completion':
          shouldUnlock = totalCompletions >= achievement.requirement;
          break;
        case 'level':
          shouldUnlock = user.level >= achievement.requirement;
          break;
        case 'special':
          shouldUnlock = this.checkSpecialAchievement(achievement.id, user, habits);
          break;
      }

      if (shouldUnlock) {
        newAchievements.push({
          ...achievement,
          isUnlocked: true,
          unlockedAt: new Date(),
        });
      }
    });

    return newAchievements;
  }

  private static checkSpecialAchievement(achievementId: string, user: User, habits: Habit[]): boolean {
    switch (achievementId) {
      case 'perfect_week':
        // Check if all habits were completed for 7 consecutive days
        return this.checkPerfectWeek(habits);
      case 'early_bird':
        // Check if any habit was completed before 8 AM
        return habits.some(habit => 
          habit.completionHistory.some(date => date.getHours() < 8)
        );
      case 'night_owl':
        // Check if any habit was completed after 10 PM
        return habits.some(habit => 
          habit.completionHistory.some(date => date.getHours() >= 22)
        );
      default:
        return false;
    }
  }

  private static checkPerfectWeek(habits: Habit[]): boolean {
    if (habits.length === 0) return false;

    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const allCompleted = habits.every(habit => 
        habit.completionHistory.some(completionDate => 
          this.isSameDay(completionDate, checkDate)
        )
      );
      
      if (!allCompleted) return false;
    }

    return true;
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}