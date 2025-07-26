import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { RootState } from '../store';
import { AnalyticsService } from '../services/analyticsService';

const { width } = Dimensions.get('window');

export const StatsScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { habits } = useSelector((state: RootState) => state.habits);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading stats...</Text>
      </View>
    );
  }

  const analytics = AnalyticsService.generateAnalytics(habits);
  const streakInsights = AnalyticsService.getStreakInsights(habits);
  
  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;
  const longestStreak = streakInsights.longestStreak;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#10B981',
    },
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string; subtitle?: string }> = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const progressData = selectedPeriod === 'week' ? analytics.weeklyProgress : analytics.monthlyProgress;
  const labels = selectedPeriod === 'week' 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  const categoryData = Object.entries(analytics.categoryBreakdown).map(([category, count]) => ({
    name: category,
    population: count,
    color: getRandomColor(),
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Your Progress</Text>
        <Text style={styles.subtitle}>Track your habit journey</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Level & XP Overview */}
        <View style={styles.levelCard}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelEmoji}>🏆</Text>
            <Text style={styles.levelNumber}>Level {user.level}</Text>
            <Text style={styles.totalXP}>{user.totalXP} Total XP</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(user.currentLevelXP / user.nextLevelXP) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {user.currentLevelXP}/{user.nextLevelXP} XP to next level
            </Text>
          </View>
        </View>

        {/* Key Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Completion Rate"
            value={`${analytics.completionRate}%`}
            icon="✅"
            color="#10B981"
            subtitle="Last 30 days"
          />
          <StatCard
            title="Current Streaks"
            value={streakInsights.currentStreaks}
            icon="🔥"
            color="#f59e0b"
            subtitle="Active habits"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Longest Streak"
            value={longestStreak}
            icon="⚡"
            color="#8b5cf6"
            subtitle="Best performance"
          />
          <StatCard
            title="Total Completed"
            value={analytics.totalHabitsCompleted}
            icon="🎯"
            color="#06b6d4"
            subtitle="All time"
          />
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'week' && styles.periodButtonTextActive,
            ]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'month' && styles.periodButtonTextActive,
            ]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Habit Completions ({selectedPeriod === 'week' ? 'Last 7 Days' : 'Last 30 Days'})
          </Text>
          <LineChart
            data={{
              labels: selectedPeriod === 'week' ? labels : labels.filter((_, i) => i % 5 === 0),
              datasets: [{
                data: selectedPeriod === 'week' ? progressData : progressData.filter((_, i) => i % 5 === 0),
              }],
            }}
            width={width - 60}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Habits by Category</Text>
            <PieChart
              data={categoryData}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </View>
        )}

        {/* Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>📈 Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Most Productive Day:</Text>
            <Text style={styles.insightValue}>{analytics.mostProductiveDay}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Average Streak:</Text>
            <Text style={styles.insightValue}>{analytics.averageStreak} days</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Streak Distribution:</Text>
            <View style={styles.streakDistribution}>
              {Object.entries(streakInsights.streakDistribution).map(([range, count]) => (
                <View key={range} style={styles.streakItem}>
                  <Text style={styles.streakRange}>{range}</Text>
                  <Text style={styles.streakCount}>{count} habits</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Habit Breakdown */}
        <View style={styles.habitBreakdownCard}>
          <Text style={styles.chartTitle}>Habit Performance</Text>
          {habits.map(habit => (
            <View key={habit.id} style={styles.habitItem}>
              <View style={styles.habitInfo}>
                <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                <View style={styles.habitDetails}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <Text style={styles.habitCategory}>{habit.category}</Text>
                </View>
              </View>
              <View style={styles.habitStats}>
                <Text style={styles.habitStreak}>🔥 {habit.streak}</Text>
                <Text style={styles.habitXP}>+{habit.xpValue} XP</Text>
                <Text style={styles.habitBest}>Best: {habit.bestStreak}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

function getRandomColor(): string {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'];
  return colors[Math.floor(Math.random() * colors.length)];
}

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
  content: {
    flex: 1,
    padding: 20,
  },
  levelCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  levelEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  totalXP: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  insightsCard: {
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
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  streakDistribution: {
    marginTop: 8,
  },
  streakItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  streakRange: {
    fontSize: 14,
    color: '#6b7280',
  },
  streakCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  habitBreakdownCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  habitDetails: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  habitCategory: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  habitStats: {
    alignItems: 'flex-end',
  },
  habitStreak: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 2,
  },
  habitXP: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  habitBest: {
    fontSize: 11,
    color: '#9ca3af',
  },
});