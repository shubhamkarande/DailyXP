import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis } from 'victory-native';
import { RootState } from '../store';

const { width } = Dimensions.get('window');

export const StatsScreen: React.FC = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { habits } = useSelector((state: RootState) => state.habits);

  if (!profile) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Loading stats...</Text>
      </View>
    );
  }

  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);

  // Mock data for XP progress chart
  const xpData = Array.from({ length: 7 }, (_, i) => ({
    x: i + 1,
    y: Math.max(0, profile.totalXP - (6 - i) * 20 + Math.random() * 40),
  }));

  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({
    title,
    value,
    icon,
    color,
  }) => (
    <View className={`bg-white rounded-xl p-4 flex-1 mx-1 border-l-4 border-${color}-500`}>
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className={`text-2xl font-bold text-${color}-600 mb-1`}>{value}</Text>
      <Text className="text-gray-600 text-sm">{title}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Your Progress</Text>

      {/* Level & XP Overview */}
      <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <View className="items-center mb-4">
          <Text className="text-4xl mb-2">🏆</Text>
          <Text className="text-3xl font-bold text-purple-600">Level {profile.level}</Text>
          <Text className="text-gray-600">{profile.totalXP} Total XP</Text>
        </View>
        
        <View className="bg-gray-200 rounded-full h-4 mb-2">
          <View
            className="bg-purple-500 h-4 rounded-full"
            style={{ width: `${(profile.currentLevelXP / profile.nextLevelXP) * 100}%` }}
          />
        </View>
        <Text className="text-center text-gray-600 text-sm">
          {profile.currentLevelXP}/{profile.nextLevelXP} XP to next level
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="flex-row mb-6">
        <StatCard
          title="Total Habits"
          value={habits.length}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Avg Streak"
          value={avgStreak}
          icon="🔥"
          color="orange"
        />
      </View>

      <View className="flex-row mb-6">
        <StatCard
          title="Longest Streak"
          value={longestStreak}
          icon="⚡"
          color="yellow"
        />
        <StatCard
          title="Total XP"
          value={profile.totalXP}
          icon="⭐"
          color="green"
        />
      </View>

      {/* XP Progress Chart */}
      <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">XP Progress (Last 7 Days)</Text>
        <VictoryChart
          width={width - 60}
          height={200}
          padding={{ left: 50, top: 20, right: 20, bottom: 40 }}
        >
          <VictoryAxis dependentAxis />
          <VictoryAxis />
          <VictoryArea
            data={xpData}
            style={{
              data: { fill: '#10B981', fillOpacity: 0.3, stroke: '#059669', strokeWidth: 2 }
            }}
          />
        </VictoryChart>
      </View>

      {/* Habit Breakdown */}
      <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">Habit Breakdown</Text>
        {habits.map(habit => (
          <View key={habit.id} className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Text className="text-xl mr-3">{habit.emoji}</Text>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">{habit.title}</Text>
                <Text className="text-gray-500 text-sm">{habit.category}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="font-semibold text-orange-600">🔥 {habit.streak}</Text>
              <Text className="text-gray-500 text-sm">+{habit.xpValue} XP</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};