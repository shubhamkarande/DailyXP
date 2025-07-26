import { Challenge, Habit, User } from '../types';

export const ACTIVE_CHALLENGES: Challenge[] = [
  {
    id: 'streak_master_weekly',
    title: '7-Day Streak Master',
    description: 'Complete all your habits for 7 consecutive days',
    icon: '🔥',
    xpReward: 500,
    startDate: new Date(2025, 0, 20), // January 20, 2025
    endDate: new Date(2025, 0, 27),   // January 27, 2025
    participants: [],
    type: 'weekly',
    requirement: 7,
    isActive: true,
  },
  {
    id: 'early_bird_challenge',
    title: 'Early Bird Challenge',
    description: 'Complete a habit before 8 AM for 5 days this week',
    icon: '🐦',
    xpReward: 300,
    startDate: new Date(2025, 0, 20),
    endDate: new Date(2025, 0, 27),
    participants: [],
    type: 'weekly',
    requirement: 5,
    isActive: true,
  },
  {
    id: 'fitness_focus_monthly',
    title: 'Fitness Focus Month',
    description: 'Complete 20 fitness-related habits this month',
    icon: '💪',
    xpReward: 800,
    startDate: new Date(2025, 0, 1),  // January 1, 2025
    endDate: new Date(2025, 0, 31),   // January 31, 2025
    participants: [],
    type: 'monthly',
    requirement: 20,
    isActive: true,
  },
  {
    id: 'mindfulness_master',
    title: 'Mindfulness Master',
    description: 'Complete 15 mindfulness habits this month',
    icon: '🧘',
    xpReward: 600,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
    participants: [],
    type: 'monthly',
    requirement: 15,
    isActive: true,
  },
  {
    id: 'consistency_champion',
    title: 'Consistency Champion',
    description: 'Don\'t miss any habit for 3 consecutive days',
    icon: '⚡',
    xpReward: 400,
    startDate: new Date(2025, 0, 20),
    endDate: new Date(2025, 0, 27),
    participants: [],
    type: 'weekly',
    requirement: 3,
    isActive: true,
  },
  {
    id: 'learning_legend',
    title: 'Learning Legend',
    description: 'Complete 10 learning-related habits this month',
    icon: '📚',
    xpReward: 500,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
    participants: [],
    type: 'monthly',
    requirement: 10,
    isActive: true,
  },
];

export class ChallengeService {
  static getActiveChallenges(): Challenge[] {
    const now = new Date();
    return ACTIVE_CHALLENGES.filter(challenge => 
      challenge.isActive && 
      challenge.startDate <= now && 
      challenge.endDate >= now
    );
  }

  static getChallengeById(id: string): Challenge | undefined {
    return ACTIVE_CHALLENGES.find(challenge => challenge.id === id);
  }

  static joinChallenge(challengeId: string, userId: string): boolean {
    const challenge = this.getChallengeById(challengeId);
    if (!challenge || challenge.participants.includes(userId)) {
      return false;
    }

    challenge.participants.push(userId);
    return true;
  }

  static leaveChallenge(challengeId: string, userId: string): boolean {
    const challenge = this.getChallengeById(challengeId);
    if (!challenge) return false;

    const index = challenge.participants.indexOf(userId);
    if (index > -1) {
      challenge.participants.splice(index, 1);
      return true;
    }
    return false;
  }

  static checkChallengeProgress(
    challenge: Challenge, 
    user: User, 
    habits: Habit[]
  ): {
    progress: number;
    isCompleted: boolean;
    daysRemaining: number;
  } {
    const now = new Date();
    const daysRemaining = Math.ceil((challenge.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let progress = 0;
    let isCompleted = false;

    switch (challenge.id) {
      case 'streak_master_weekly':
        progress = this.calculateStreakMasterProgress(habits, challenge.startDate);
        isCompleted = progress >= challenge.requirement;
        break;

      case 'early_bird_challenge':
        progress = this.calculateEarlyBirdProgress(habits, challenge.startDate);
        isCompleted = progress >= challenge.requirement;
        break;

      case 'fitness_focus_monthly':
        progress = this.calculateCategoryProgress(habits, 'Fitness', challenge.startDate);
        isCompleted = progress >= challenge.requirement;
        break;

      case 'mindfulness_master':
        progress = this.calculateCategoryProgress(habits, 'Mindfulness', challenge.startDate);
        isCompleted = progress >= challenge.requirement;
        break;

      case 'consistency_champion':
        progress = this.calculateConsistencyProgress(habits, challenge.startDate);
        isCompleted = progress >= challenge.requirement;
        break;

      case 'learning_legend':
        progress = this.calculateCategoryProgress(habits, 'Learning', challenge.startDate);
        isCompleted = progress >= challenge.requirement;
        break;

      default:
        progress = 0;
        isCompleted = false;
    }

    return {
      progress,
      isCompleted,
      daysRemaining: Math.max(0, daysRemaining),
    };
  }

  private static calculateStreakMasterProgress(habits: Habit[], startDate: Date): number {
    // Count consecutive days where all habits were completed
    let consecutiveDays = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (checkDate > today) break;

      const allCompleted = habits.every(habit => 
        habit.completionHistory.some(completionDate => 
          this.isSameDay(completionDate, checkDate)
        )
      );

      if (allCompleted) {
        consecutiveDays++;
      } else {
        consecutiveDays = 0; // Reset if any day is missed
      }
    }

    return consecutiveDays;
  }

  private static calculateEarlyBirdProgress(habits: Habit[], startDate: Date): number {
    let earlyCompletions = 0;
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    habits.forEach(habit => {
      habit.completionHistory.forEach(completionDate => {
        if (completionDate >= startDate && 
            completionDate <= endDate && 
            completionDate.getHours() < 8) {
          earlyCompletions++;
        }
      });
    });

    return Math.min(earlyCompletions, 7); // Max 1 per day for 7 days
  }

  private static calculateCategoryProgress(habits: Habit[], category: string, startDate: Date): number {
    let categoryCompletions = 0;
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    habits
      .filter(habit => habit.category === category)
      .forEach(habit => {
        habit.completionHistory.forEach(completionDate => {
          if (completionDate >= startDate && completionDate <= endDate) {
            categoryCompletions++;
          }
        });
      });

    return categoryCompletions;
  }

  private static calculateConsistencyProgress(habits: Habit[], startDate: Date): number {
    let consecutiveDays = 0;
    let maxConsecutive = 0;
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (checkDate > today) break;

      const anyCompleted = habits.some(habit => 
        habit.completionHistory.some(completionDate => 
          this.isSameDay(completionDate, checkDate)
        )
      );

      if (anyCompleted) {
        consecutiveDays++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
      } else {
        consecutiveDays = 0;
      }
    }

    return maxConsecutive;
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  static getUserChallenges(userId: string): Challenge[] {
    return ACTIVE_CHALLENGES.filter(challenge => 
      challenge.participants.includes(userId)
    );
  }

  static getCompletedChallenges(user: User, habits: Habit[]): Challenge[] {
    const userChallenges = this.getUserChallenges(user.id);
    
    return userChallenges.filter(challenge => {
      const progress = this.checkChallengeProgress(challenge, user, habits);
      return progress.isCompleted;
    });
  }

  static generateWeeklyChallenges(): Challenge[] {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const weeklyTemplates = [
      {
        id: 'perfect_week',
        title: 'Perfect Week',
        description: 'Complete all habits every day this week',
        icon: '✨',
        xpReward: 600,
        requirement: 7,
      },
      {
        id: 'habit_explorer',
        title: 'Habit Explorer',
        description: 'Try 3 different habit categories this week',
        icon: '🗺️',
        xpReward: 400,
        requirement: 3,
      },
      {
        id: 'weekend_warrior',
        title: 'Weekend Warrior',
        description: 'Don\'t skip habits on weekends',
        icon: '🏃',
        xpReward: 300,
        requirement: 2,
      },
    ];

    return weeklyTemplates.map(template => ({
      ...template,
      startDate,
      endDate,
      participants: [],
      type: 'weekly' as const,
      isActive: true,
    }));
  }

  static generateMonthlyChallenges(): Challenge[] {
    const startDate = new Date();
    startDate.setDate(1); // First day of month
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of month

    const monthlyTemplates = [
      {
        id: 'habit_master',
        title: 'Habit Master',
        description: 'Complete 100 habits this month',
        icon: '🏆',
        xpReward: 1000,
        requirement: 100,
      },
      {
        id: 'category_champion',
        title: 'Category Champion',
        description: 'Master all habit categories this month',
        icon: '🌟',
        xpReward: 800,
        requirement: 5,
      },
      {
        id: 'streak_builder',
        title: 'Streak Builder',
        description: 'Build a 20-day streak this month',
        icon: '🔥',
        xpReward: 700,
        requirement: 20,
      },
    ];

    return monthlyTemplates.map(template => ({
      ...template,
      startDate,
      endDate,
      participants: [],
      type: 'monthly' as const,
      isActive: true,
    }));
  }

  static getChallengeRecommendations(user: User, habits: Habit[]): Challenge[] {
    const activeChallenges = this.getActiveChallenges();
    const userChallenges = this.getUserChallenges(user.id);
    
    // Filter out challenges user is already participating in
    const availableChallenges = activeChallenges.filter(challenge => 
      !userChallenges.some(userChallenge => userChallenge.id === challenge.id)
    );

    // Sort by relevance based on user's habits
    return availableChallenges.sort((a, b) => {
      const scoreA = this.calculateChallengeRelevance(a, habits);
      const scoreB = this.calculateChallengeRelevance(b, habits);
      return scoreB - scoreA;
    });
  }

  private static calculateChallengeRelevance(challenge: Challenge, habits: Habit[]): number {
    let score = 0;

    // Base score for all challenges
    score += 10;

    // Bonus for challenges matching user's habit categories
    if (challenge.id.includes('fitness') && habits.some(h => h.category === 'Fitness')) {
      score += 20;
    }
    if (challenge.id.includes('mindfulness') && habits.some(h => h.category === 'Mindfulness')) {
      score += 20;
    }
    if (challenge.id.includes('learning') && habits.some(h => h.category === 'Learning')) {
      score += 20;
    }

    // Bonus for streak-related challenges if user has good streaks
    if (challenge.id.includes('streak')) {
      const avgStreak = habits.reduce((sum, h) => sum + h.streak, 0) / habits.length;
      if (avgStreak > 5) score += 15;
    }

    // Bonus for consistency challenges if user is consistent
    if (challenge.id.includes('consistency')) {
      const activeStreaks = habits.filter(h => h.streak > 0).length;
      const consistencyRate = activeStreaks / habits.length;
      if (consistencyRate > 0.7) score += 15;
    }

    return score;
  }
}