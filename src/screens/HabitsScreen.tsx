import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store';
import { HabitCard } from '../components/HabitCard';

export const HabitsScreen: React.FC = () => {
  const { habits } = useSelector((state: RootState) => state.habits);
  const navigation = useNavigation();

  const handleEditHabit = (habit: any) => {
    navigation.navigate('HabitEditor', { habit });
  };

  const handleAddHabit = () => {
    navigation.navigate('HabitTemplates');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚡ My Habits</Text>
        <Text style={styles.subtitle}>Manage your daily habits</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Habit Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Text style={styles.addButtonIcon}>+</Text>
          <View style={styles.addButtonText}>
            <Text style={styles.addButtonTitle}>Add New Habit</Text>
            <Text style={styles.addButtonSubtitle}>Choose from templates or create custom</Text>
          </View>
        </TouchableOpacity>

        {/* Active Habits */}
        <Text style={styles.sectionTitle}>Active Habits ({habits.filter(h => h.isActive).length})</Text>
        
        {habits.filter(h => h.isActive).map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onComplete={() => {}}
            onEdit={handleEditHabit}
            showDetails={true}
          />
        ))}

        {/* Inactive Habits */}
        {habits.filter(h => !h.isActive).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Inactive Habits ({habits.filter(h => !h.isActive).length})
            </Text>
            
            {habits.filter(h => !h.isActive).map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={() => {}}
                onEdit={handleEditHabit}
                showDetails={false}
              />
            ))}
          </>
        )}

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📝</Text>
            <Text style={styles.emptyStateTitle}>No habits yet!</Text>
            <Text style={styles.emptyStateText}>
              Start building better habits by adding your first one
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddHabit}>
              <Text style={styles.emptyStateButtonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Summary */}
        {habits.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>📊 Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{habits.length}</Text>
                <Text style={styles.statLabel}>Total Habits</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {habits.filter(h => h.isActive).length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)}
                </Text>
                <Text style={styles.statLabel}>Avg Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.max(...habits.map(h => h.bestStreak), 0)}
                </Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    fontSize: 32,
    color: '#10B981',
    marginRight: 16,
    fontWeight: 'bold',
  },
  addButtonText: {
    flex: 1,
  },
  addButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  addButtonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
});