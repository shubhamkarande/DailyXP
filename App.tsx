import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';

const App: React.FC = () => {
  const [habits, setHabits] = React.useState([
    { id: '1', title: 'Drink 8 glasses of water', emoji: '💧', completed: false, xp: 20 },
    { id: '2', title: 'Exercise for 30 minutes', emoji: '💪', completed: false, xp: 30 },
    { id: '3', title: 'Read for 20 minutes', emoji: '📚', completed: false, xp: 25 },
  ]);

  const [totalXP, setTotalXP] = React.useState(0);
  const [level, setLevel] = React.useState(1);

  const completeHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id && !habit.completed) {
        setTotalXP(prevXP => {
          const newXP = prevXP + habit.xp;
          setLevel(Math.floor(newXP / 100) + 1);
          return newXP;
        });
        return { ...habit, completed: true };
      }
      return habit;
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎮 DailyXP</Text>
        <Text style={styles.subtitle}>Level {level} • {totalXP} XP</Text>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${(totalXP % 100)}%` }]} />
        </View>
        <Text style={styles.xpText}>{totalXP % 100}/100 XP to next level</Text>
      </View>

      {/* Habits List */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        
        {habits.map(habit => (
          <TouchableOpacity
            key={habit.id}
            style={[styles.habitCard, habit.completed && styles.habitCompleted]}
            onPress={() => completeHabit(habit.id)}
            disabled={habit.completed}
          >
            <Text style={styles.habitEmoji}>{habit.emoji}</Text>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitTitle, habit.completed && styles.habitTitleCompleted]}>
                {habit.title}
              </Text>
              <Text style={styles.habitXP}>+{habit.xp} XP</Text>
            </View>
            <View style={[styles.checkButton, habit.completed && styles.checkButtonCompleted]}>
              <Text style={styles.checkText}>{habit.completed ? '✓' : '+'}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Complete habits to earn XP and level up! 🚀
          </Text>
        </View>
      </ScrollView>
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
    borderRadius: 12,
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
    fontSize: 24,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  habitTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#059669',
  },
  habitXP: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '500',
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#10b981',
  },
  checkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontStyle: 'italic',
  },
});

export default App;
