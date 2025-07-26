export interface Habit {
  id: string;
  title: string;
  category: string;
  emoji: string;
  xpValue: number;
  streak: number;
  lastCompleted?: Date;
  createdAt: Date;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  reminderTime?: string;
  isActive: boolean;
  completionHistory: Date[];
  bestStreak: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  habits: Habit[];
  createdAt: Date;
  achievements: Achievement[];
  friends: string[];
  theme: 'light' | 'dark' | 'colorful';
  avatar: string;
  preferences: UserPreferences;
}

export interface XPReward {
  amount: number;
  levelUp: boolean;
  newLevel?: number;
}

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
  HabitEditor: { habit?: Habit };
  Achievements: undefined;
  HabitTemplates: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  Habits: undefined;
  Social: undefined;
  Profile: undefined;
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: Date;
  isUnlocked: boolean;
  category: 'streak' | 'completion' | 'level' | 'social' | 'special';
  requirement: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  startDate: Date;
  endDate: Date;
  participants: string[];
  type: 'daily' | 'weekly' | 'monthly';
  requirement: number;
  isActive: boolean;
}

export interface HabitTemplate {
  id: string;
  title: string;
  category: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  tips: string[];
  isPopular: boolean;
}

export interface UserPreferences {
  notifications: boolean;
  reminderTime: string;
  weekStartsOn: 'sunday' | 'monday';
  theme: 'light' | 'dark' | 'colorful';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface StreakReward {
  streakLength: number;
  xpBonus: number;
  title: string;
  description: string;
  icon: string;
}

export interface Analytics {
  completionRate: number;
  averageStreak: number;
  totalHabitsCompleted: number;
  mostProductiveDay: string;
  weeklyProgress: number[];
  monthlyProgress: number[];
  categoryBreakdown: { [category: string]: number };
}