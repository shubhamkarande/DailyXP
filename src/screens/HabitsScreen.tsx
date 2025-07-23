import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { RootState } from '../store';
import { Habit } from '../types';

export const HabitsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { habits } = useSelector((state: RootState) => state.habits);

  const handleEditHabit = (habit: Habit) => {
    navigation.navigate('HabitEditor' as never, { habit } as never);
  };

  const handleAddHabit = () => {
    navigation.navigate('HabitEditor' as never);
  };

  const HabitItem: React.FC<{ habit: Habit }> = ({ habit }) => (
    <TouchableOpacity
      onPress={() => handleEditHabit(habit)}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border-l-4 border-blue-500"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">{habit.emoji}</Text>
          <View className="flex-1">
            <Text className="font-semibold text-lg text-gray-800">
              {habit.title}
            </Text>
            <Text className="text-gray-500 text-sm">{habit.category}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-orange-600 font-medium text-sm">
                +{habit.xpValue} XP
              </Text>
              <Text className="text-gray-400 text-sm ml-2">
                🔥 {habit.streak} streak
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-gray-400 text-lg">›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-800">My Habits</Text>
          <TouchableOpacity
            onPress={handleAddHabit}
            className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow-sm"
          >
            <Text className="text-white text-2xl">+</Text>
          </TouchableOpacity>
        </View>

        {habits.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center shadow-sm">
            <Text className="text-6xl mb-4">🌱</Text>
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              No habits yet
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Start building better habits to level up your life!
            </Text>
            <TouchableOpacity onPress={handleAddHabit}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                className="py-3 px-6 rounded-xl"
              >
                <Text className="text-white font-semibold">
                  Create Your First Habit
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-6">
            {habits.map(habit => (
              <HabitItem key={habit.id} habit={habit} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};