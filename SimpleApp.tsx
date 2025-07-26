import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';

interface SimpleHabit {
  id: string;
  title: string;
  emoji: string;
  completed: boolean;
  xp: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  streak: number;
  bestStreak: number;
}

const SimpleApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'habits' | 'stats' | 'achievements'>('home');
  const [showAddHabit, setShowAddHabit] = React.useState(false);
  const [newHabitTitle, setNewHabitTitle] = React.useState('');
  const [newHabitEmoji, setNewHabitEmoji] = React.useState('⭐');
  const [newHabitCategory, setNewHabitCategory] = React.useState('General');
  
  const [habits, setHabits] = React.useState<SimpleHabit[]>([
    { 
      id: '1', 
      title: 'Drink 8 glasses of water', 
      emoji: '💧', 
      completed: false, 
      xp: 20,
      category: 'Health',
      difficulty: 'easy',
      streak: 3,
      bestStreak: 7,
    },
    { 
      id: '2', 
      title: 'Exercise for 30 minutes', 
      emoji: '💪', 
      completed: false, 
      xp: 30,
      category: 'Fitness',
      difficulty: 'medium',
      streak: 5,
      bestStreak: 12,
    },
    { 
      id: '3', 
      title: 'Read for 20 minutes', 
      emoji: '📚', 
      completed: false, 
      xp: 25,
      category: 'Learning',
      difficulty: 'easy',
      streak: 2,
      bestStreak: 15,
    },
    { 
      id: '4', 
      title: 'Meditate for 10 minutes', 
      emoji: '🧘', 
      completed: false, 
      xp: 25,
      category: 'Mindfulness',
      difficulty: 'medium',
      streak: 1,
      bestStreak: 8,
    },
    { 
      id: '5', 
      title: 'Write in journal', 
      emoji: '📝', 
      completed: false, 
      xp: 15,
      category: 'Mindfulness',
      difficulty: 'easy',
      streak: 4,
      bestStreak: 10,
    },
  ]);

  const [totalXP, setTotalXP] = React.useState(1250);
  const [level, setLevel] = React.useState(13);

  const achievements = [
    { id: '1', title: 'Getting Started', description: 'Complete a habit for 3 days in a row', icon: '🔥', unlocked: true },
    { id: '2', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', unlocked: true },
    { id: '3', title: 'Monthly Master', description: 'Keep a habit going for 30 days', icon: '👑', unlocked: false },
    { id: '4', title: 'Habit Novice', description: 'Complete 10 habits total', icon: '🌱', unlocked: true },
    { id: '5', title: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: true },
  ];

  const categories = ['Health', 'Fitness', 'Learning', 'Mindfulness', 'Productivity', 'General'];
  const emojis = ['⭐', '💧', '💪', '📚', '🧘', '📝', '🏃', '🎯', '🌱', '🔥', '⚡', '🎨'];

  const completeHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id && !habit.completed) {
        const streakMultiplier = habit.streak >= 7 ? 1.5 : habit.streak >= 3 ? 1.25 : 1;
        const xpGained = Math.round(habit.xp * streakMultiplier);
        
        setTotalXP(prevXP => {
          const newXP = prevXP + xpGained;
          const newLevel = Math.floor(newXP / 100) + 1;
          
          if (newLevel > level) {
            Alert.alert(
              '🎉 Level Up!',
              `Congratulations! You've reached level ${newLevel}!`,
              [{ text: 'Awesome!', style: 'default' }]
            );
          }
          
          setLevel(newLevel);
          return newXP;
        });
        
        // Show XP gained with multiplier
        if (streakMultiplier > 1) {
          Alert.alert(
            '🔥 Streak Bonus!',
            `You earned ${xpGained} XP (${habit.xp} × ${streakMultiplier.toFixed(2)} streak bonus)!`,
            [{ text: 'Nice!', style: 'default' }]
          );
        }
        
        return { 
          ...habit, 
          completed: true,
          streak: habit.streak + 1,
          bestStreak: Math.max(habit.bestStreak, habit.streak + 1),
        };
      }
      return habit;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const resetHabits = () => {
    Alert.alert(
      'Reset Daily Habits',
      'This will mark all habits as incomplete for a new day. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            setHabits(prev => prev.map(habit => ({ ...habit, completed: false })));
          }
        },
      ]
    );
  };

  const addNewHabit = () => {
    if (!newHabitTitle.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    const newHabit: SimpleHabit = {
      id: Date.now().toString(),
      title: newHabitTitle.trim(),
      emoji: newHabitEmoji,
      category: newHabitCategory,
      difficulty: 'medium',
      xp: 25,
      streak: 0,
      bestStreak: 0,
      completed: false,
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitTitle('');
    setNewHabitEmoji('⭐');
    setNewHabitCategory('General');
    setShowAddHabit(false);
    Alert.alert('Success', 'New habit added!');
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionRate = Math.round((completedCount / totalHabits) * 100);

  const renderHomeScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Today's Habits</Text>
      
      {habits.map(habit => (
        <TouchableOpacity
          key={habit.id}
          style={[styles.habitCard, habit.completed && styles.habitCompleted]}
          onPress={() => completeHabit(habit.id)}
          disabled={habit.completed}
          activeOpacity={0.8}
        >
          <Text style={styles.habitEmoji}>{habit.emoji}</Text>
          <View style={styles.habitInfo}>
            <Text style={[styles.habitTitle, habit.completed && styles.habitTitleCompleted]}>
              {habit.title}
            </Text>
            <View style={styles.habitMeta}>
              <Text style={styles.habitCategory}>{habit.category}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(habit.difficulty) }]}>
                <Text style={styles.difficultyText}>{habit.difficulty.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.habitStats}>
              <Text style={styles.habitXP}>+{habit.xp} XP</Text>
              <Text style={styles.habitStreak}>🔥 {habit.streak} streak</Text>
              <Text style={styles.habitBest}>Best: {habit.bestStreak}</Text>
            </View>
          </View>
          <View style={[styles.checkButton, habit.completed && styles.checkButtonCompleted]}>
            <Text style={styles.checkText}>{habit.completed ? '✓' : '+'}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎯 Complete habits to earn XP and build streaks!
        </Text>
        <Text style={styles.footerSubtext}>
          Navigate using the tabs below
        </Text>
      </View>
    </ScrollView>
  );

  const renderHabitsScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddHabit(true)}>
        <Text style={styles.addButtonIcon}>+</Text>
        <View style={styles.addButtonText}>
          <Text style={styles.addButtonTitle}>Add New Habit</Text>
          <Text style={styles.addButtonSubtitle}>Create a custom habit</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Habits ({habits.length})</Text>
      
      {habits.map(habit => (
        <View key={habit.id} style={styles.habitCard}>
          <Text style={styles.habitEmoji}>{habit.emoji}</Text>
          <View style={styles.habitInfo}>
            <Text style={styles.habitTitle}>{habit.title}</Text>
            <Text style={styles.habitCategory}>{habit.category}</Text>
            <Text style={styles.habitStreak}>🔥 {habit.streak} streak (Best: {habit.bestStreak})</Text>
          </View>
          <Text style={styles.habitXP}>+{habit.xp} XP</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderStatsScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.max(...habits.map(h => h.bestStreak), 0)}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) || 0}</Text>
            <Text style={styles.statLabel}>Avg Streak</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoryStats}>
        <Text style={styles.statsTitle}>📈 Category Breakdown</Text>
        {categories.map(cat => {
          const categoryHabits = habits.filter(h => h.category === cat);
          if (categoryHabits.length === 0) return null;
          return (
            <View key={cat} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{cat}</Text>
              <Text style={styles.categoryCount}>{categoryHabits.length} habits</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderAchievementsScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>🏆 Achievements</Text>
      <Text style={styles.achievementSubtitle}>
        {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
      </Text>
      
      {achievements.map(achievement => (
        <View key={achievement.id} style={[
          styles.achievementCard,
          achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
        ]}>
          <Text style={styles.achievementIcon}>{achievement.unlocked ? achievement.icon : '🔒'}</Text>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>
              {achievement.title}
            </Text>
            <Text style={[styles.achievementDescription, !achievement.unlocked && styles.lockedText]}>
              {achievement.description}
            </Text>
          </View>
          {achievement.unlocked && (
            <Text style={styles.unlockedBadge}>✓</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎮 DailyXP Enhanced</Text>
        <Text style={styles.subtitle}>Level {level} • {totalXP} XP</Text>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${(totalXP % 100)}%` }]} />
        </View>
        <Text style={styles.xpText}>{totalXP % 100}/100 XP to next level</Text>
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
          <Text style={styles.statValue}>{Math.max(...habits.map(h => h.bestStreak))}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
        <View style={styles.statItem}>
          <TouchableOpacity onPress={resetHabits} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>🔄</Text>
          </TouchableOpacity>
          <Text style={styles.statLabel}>Reset</Text>
        </View>
      </View>

      {/* Screen Content */}
      {currentScreen === 'home' && renderHomeScreen()}
      {currentScreen === 'habits' && renderHabitsScreen()}
      {currentScreen === 'stats' && renderStatsScreen()}
      {currentScreen === 'achievements' && renderAchievementsScreen()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'home' && styles.activeNavButton]}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={[styles.navIcon, currentScreen === 'home' && styles.activeNavIcon]}>🏠</Text>
          <Text style={[styles.navLabel, currentScreen === 'home' && styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'habits' && styles.activeNavButton]}
          onPress={() => setCurrentScreen('habits')}
        >
          <Text style={[styles.navIcon, currentScreen === 'habits' && styles.activeNavIcon]}>⚡</Text>
          <Text style={[styles.navLabel, currentScreen === 'habits' && styles.activeNavLabel]}>Habits</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'stats' && styles.activeNavButton]}
          onPress={() => setCurrentScreen('stats')}
        >
          <Text style={[styles.navIcon, currentScreen === 'stats' && styles.activeNavIcon]}>📊</Text>
          <Text style={[styles.navLabel, currentScreen === 'stats' && styles.activeNavLabel]}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'achievements' && styles.activeNavButton]}
          onPress={() => setCurrentScreen('achievements')}
        >
          <Text style={[styles.navIcon, currentScreen === 'achievements' && styles.activeNavIcon]}>🏆</Text>
          <Text style={[styles.navLabel, currentScreen === 'achievements' && styles.activeNavLabel]}>Awards</Text>
        </TouchableOpacity>
      </View>

      {/* Add Habit Modal */}
      <Modal
        visible={showAddHabit}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddHabit(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Habit</Text>
            <TouchableOpacity onPress={addNewHabit}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Habit Title</Text>
              <TextInput
                style={styles.formInput}
                value={newHabitTitle}
                onChangeText={setNewHabitTitle}
                placeholder="e.g., Drink 8 glasses of water"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Choose Emoji</Text>
              <View style={styles.emojiGrid}>
                {emojis.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiOption,
                      newHabitEmoji === emoji && styles.selectedEmoji,
                    ]}
                    onPress={() => setNewHabitEmoji(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      newHabitCategory === cat && styles.selectedCategory,
                    ]}
                    onPress={() => setNewHabitCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryText,
                      newHabitCategory === cat && styles.selectedCategoryText,
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
  resetButton: {
    backgroundColor: '#f3f4f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  resetButtonText: {
    fontSize: 16,
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
  habitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  habitCompleted: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#10b981',
  },
  habitEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  habitTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#059669',
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  habitCategory: {
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
  habitStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitXP: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: 'bold',
    marginRight: 12,
  },
  habitStreak: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginRight: 8,
  },
  habitBest: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#10b981',
  },
  checkText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievementPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  achievementXP: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  featurePreview: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavButton: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeNavIcon: {
    color: '#10B981',
  },
  navLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  activeNavLabel: {
    color: '#10B981',
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  categoryStats: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryName: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementUnlocked: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  lockedText: {
    opacity: 0.7,
  },
  unlockedBadge: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiOption: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedEmoji: {
    borderColor: '#10B981',
    backgroundColor: '#f0fdf4',
  },
  emojiText: {
    fontSize: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategory: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: 'white',
  },
});

export default SimpleApp;