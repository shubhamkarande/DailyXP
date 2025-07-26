import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { Habit } from '../types';
import { StreakRewardService } from '../services/streakRewards';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onEdit?: (habit: Habit) => void;
  showDetails?: boolean;
}

const { width } = Dimensions.get('window');

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onComplete,
  onEdit,
  showDetails = false,
}) => {
  const scaleValue = new Animated.Value(1);
  const progressValue = new Animated.Value(0);
  const [isCompleted, setIsCompleted] = React.useState(habit.isCompleted);

  React.useEffect(() => {
    if (isCompleted) {
      Animated.timing(progressValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [isCompleted]);

  const handlePress = () => {
    if (isCompleted) return;

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsCompleted(true);
    onComplete(habit.id);
  };

  const getDifficultyColor = () => {
    switch (habit.difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = () => {
    return habit.difficulty?.toUpperCase() || 'MEDIUM';
  };

  const streakEmoji = StreakRewardService.getStreakEmoji(habit.streak);
  const motivationalMessage = StreakRewardService.getMotivationalMessage(habit);
  const nextReward = StreakRewardService.getNextReward(habit.streak);
  const streakMultiplier = StreakRewardService.getStreakMultiplier(habit.streak);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <View style={[
        styles.card,
        isCompleted ? styles.completedCard : styles.activeCard,
        { borderLeftColor: getDifficultyColor() }
      ]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.habitInfo}>
            <Text style={styles.emoji}>{habit.emoji}</Text>
            <View style={styles.textContainer}>
              <Text style={[
                styles.title,
                isCompleted && styles.completedTitle
              ]}>
                {habit.title}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.category}>{habit.category}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
                  <Text style={styles.difficultyText}>{getDifficultyLabel()}</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleted ? styles.completedButton : styles.activeButton
            ]}
            onPress={handlePress}
            disabled={isCompleted}
          >
            <Text style={styles.buttonText}>
              {isCompleted ? '✓' : '+'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.xpValue}>
              +{Math.round(habit.xpValue * streakMultiplier)} XP
            </Text>
            {streakMultiplier > 1 && (
              <Text style={styles.multiplier}>
                {streakMultiplier}x bonus!
              </Text>
            )}
          </View>

          <View style={styles.statItem}>
            <Text style={styles.streakValue}>
              {streakEmoji} {habit.streak}
            </Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.bestStreak}>
              Best: {habit.bestStreak}
            </Text>
          </View>
        </View>

        {/* Progress Bar for Completion */}
        {isCompleted && (
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        )}

        {/* Motivational Message */}
        {showDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.motivationalText}>
              {motivationalMessage}
            </Text>
            
            {nextReward && (
              <View style={styles.nextRewardContainer}>
                <Text style={styles.nextRewardText}>
                  Next: {nextReward.title} ({nextReward.streakLength} days)
                </Text>
                <Text style={styles.nextRewardXP}>
                  +{nextReward.xpBonus} bonus XP
                </Text>
              </View>
            )}

            {habit.reminderTime && (
              <Text style={styles.reminderText}>
                ⏰ Reminder set for {habit.reminderTime}
              </Text>
            )}
          </View>
        )}

        {/* Edit Button */}
        {onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(habit)}
          >
            <Text style={styles.editButtonText}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  activeCard: {
    borderLeftColor: '#3b82f6',
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#10B981',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#059669',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  completeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#3b82f6',
  },
  completedButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  xpValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  multiplier: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  streakValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  streakLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  bestStreak: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  motivationalText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  nextRewardContainer: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  nextRewardText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
  nextRewardXP: {
    fontSize: 10,
    color: '#d97706',
    textAlign: 'center',
  },
  reminderText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 12,
  },
});