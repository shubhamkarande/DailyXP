import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { completeHabit, addHabit } from '../store/slices/habitsSlice';
import { updateUserXP } from '../store/slices/authSlice';
import { HabitCard } from '../components/HabitCard';
import { Habit } from '../types';

export const HomeScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { habits } = useSelector((state: RootState) => state.habits);
  const dispatch = useDispatch();

  // Initialize with sample habits if none exist
  React.useEffect(() => {
    if (habits.length === 0) {
      const sampleHabits: Habit[] = [
        {
          id: '1',
          title: 'Drink 8 glasses of water',
          emoji: '💧',
          category: 'Health',
          xpValue: 20,
          difficulty: 'easy',
          streak: 3,
          bestStreak: 7,
          isCompleted: false,
          isActive: true,
          createdAt: new Date(),
          completionHistory: [],
        },
        {
          id: '2',
          title: 'Exercise for 30 minutes',
          emoji: '💪',
          category: 'Fitness',
          xpValue: 30,
          difficulty: 'medium',
          streak: 5,
          bestStreak: 12,
          isCompleted: false,
          isActive: true,
          createdAt: new Date(),
          completionHistory: [],
        },
        {
          id: '3',
          title: 'Read for 20 minutes',
          emoji: '📚',
          category: 'Learning',
          xpValue: 25,
          difficulty: 'easy',
          streak: 2,
          bestStreak: 15,
          isCompleted: false,
          isActive: true,
          createdAt: new Date(),
          completionHistory: [],
        },
        {
          id: '4',
          title: 'Meditate for 10 minutes',
          emoji: '🧘',
          category: 'Mindfulness',
          xpValue: 25,
          difficulty: 'medium',
          streak: 1,
          bestStreak: 8,
          isCompleted: false,
          isActive: true,
          createdAt: new Date(),
          completionHistory: [],
        },
        {
          id: '5',
          title: 'Write in journal',
          emoji: '📝',
          category: 'Mindfulness',
          xpValue: 15,
          difficulty: 'easy',
          streak: 4,
          bestStreak: 10,
          isCompleted: false,
          isActive: true,
          createdAt: new Date(),
          completionHistory: [],
        },
      ];

      sampleHabits.forEach(habit => dispatch(addHabit(habit)));
    }
  }, [habits.length, dispatch]);

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.isCompleted) return;

    const streakMultiplier = habit.streak >= 7 ? 1.5 : habit.streak >= 3 ? 1.25 : 1;
    const xpGained = Math.round(habit.xpValue * streakMultiplier);
    
    // Update habit
    dispatch(completeHabit(habitId));
    
    // Update user XP
    if (user) {
      const newXP = user.totalXP + xpGained;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      dispatch(updateUserXP({ xp: newXP, level: newLevel }));
      
      if (newLevel > user.level) {
        Alert.alert(
          '🎉 Level Up!',
          `Congratulations! You've reached level ${newLevel}!`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }
      
      if (streakMultiplier > 1) {
        Alert.alert(
          '🔥 Streak Bonus!',
          `You earned ${xpGained} XP (${habit.xpValue} × ${streakMultiplier.toFixed(2)} streak bonus)!`,
          [{ text: 'Nice!', style: 'default' }]
        );
      }
    }
  };

  const completedCount = habits.filter(h => h.isCompleted).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎮 DailyXP</Text>
        <Text style={styles.subtitle}>Level {user.level} • {user.totalXP} XP</Text>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${user.currentLevelXP}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {user.currentLevelXP}/100 XP to next level
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedCount}/{totalHabits}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak)) : 0}
          </Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      {/* Habits List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        
        {habits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onComplete={handleCompleteHabit}
            showDetails={true}
          />
        ))}

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No habits yet!</Text>
            <Text style={styles.emptyStateSubtext}>
              Go to the Habits tab to add your first habit
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎯 Complete habits to earn XP and build streaks!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#10B981',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  xpContainer: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  xpText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
  },
});