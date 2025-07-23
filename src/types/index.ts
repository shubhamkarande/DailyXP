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
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  Habits: undefined;
};