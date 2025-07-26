import { Habit, Analytics } from '../types';

export class AnalyticsService {
  static generateAnalytics(habits: Habit[]): Analytics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      completionRate: this.calculateCompletionRate(habits),
      averageStreak: this.calculateAverageStreak(habits),
      totalHabitsCompleted: this.getTotalCompletions(habits),
      mostProductiveDay: this.getMostProductiveDay(habits),
      weeklyProgress: this.getWeeklyProgress(habits),
      monthlyProgress: this.getMonthlyProgress(habits),
      categoryBreakdown: this.getCategoryBreakdown(habits),
    };
  }

  private static calculateCompletionRate(habits: Habit[]): number {
    if (habits.length === 0) return 0;

    const totalPossibleCompletions = habits.length * 30; // Last 30 days
    const actualCompletions = habits.reduce((sum, habit) => {
      const recentCompletions = habit.completionHistory.filter(date => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return date >= thirtyDaysAgo;
      });
      return sum + recentCompletions.length;
    }, 0);

    return Math.round((actualCompletions / totalPossibleCompletions) * 100);
  }

  private static calculateAverageStreak(habits: Habit[]): number {
    if (habits.length === 0) return 0;

    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    return Math.round(totalStreak / habits.length);
  }

  private static getTotalCompletions(habits: Habit[]): number {
    return habits.reduce((sum, habit) => sum + habit.completionHistory.length, 0);
  }

  private static getMostProductiveDay(habits: Habit[]): string {
    const dayCount: { [key: string]: number } = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0,
    };

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    habits.forEach(habit => {
      habit.completionHistory.forEach(date => {
        const dayName = dayNames[date.getDay()];
        dayCount[dayName]++;
      });
    });

    let mostProductiveDay = 'Monday';
    let maxCount = 0;

    Object.entries(dayCount).forEach(([day, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostProductiveDay = day;
      }
    });

    return mostProductiveDay;
  }

  private static getWeeklyProgress(habits: Habit[]): number[] {
    const weeklyData: number[] = new Array(7).fill(0);
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayCompletions = habits.reduce((sum, habit) => {
        const completionsOnDay = habit.completionHistory.filter(completionDate =>
          this.isSameDay(completionDate, date)
        ).length;
        return sum + completionsOnDay;
      }, 0);
      weeklyData[6 - i] = dayCompletions;
    }

    return weeklyData;
  }

  private static getMonthlyProgress(habits: Habit[]): number[] {
    const monthlyData: number[] = new Array(30).fill(0);
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayCompletions = habits.reduce((sum, habit) => {
        const completionsOnDay = habit.completionHistory.filter(completionDate =>
          this.isSameDay(completionDate, date)
        ).length;
        return sum + completionsOnDay;
      }, 0);
      monthlyData[29 - i] = dayCompletions;
    }

    return monthlyData;
  }

  private static getCategoryBreakdown(habits: Habit[]): { [category: string]: number } {
    const categoryCount: { [category: string]: number } = {};

    habits.forEach(habit => {
      const completions = habit.completionHistory.length;
      if (categoryCount[habit.category]) {
        categoryCount[habit.category] += completions;
      } else {
        categoryCount[habit.category] = completions;
      }
    });

    return categoryCount;
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  static getStreakInsights(habits: Habit[]): {
    longestStreak: number;
    currentStreaks: number;
    streakDistribution: { [range: string]: number };
  } {
    const longestStreak = Math.max(...habits.map(h => h.bestStreak), 0);
    const currentStreaks = habits.filter(h => h.streak > 0).length;
    
    const streakDistribution = {
      '1-7 days': 0,
      '8-30 days': 0,
      '31-90 days': 0,
      '90+ days': 0,
    };

    habits.forEach(habit => {
      const streak = habit.bestStreak;
      if (streak >= 1 && streak <= 7) streakDistribution['1-7 days']++;
      else if (streak >= 8 && streak <= 30) streakDistribution['8-30 days']++;
      else if (streak >= 31 && streak <= 90) streakDistribution['31-90 days']++;
      else if (streak > 90) streakDistribution['90+ days']++;
    });

    return {
      longestStreak,
      currentStreaks,
      streakDistribution,
    };
  }
}