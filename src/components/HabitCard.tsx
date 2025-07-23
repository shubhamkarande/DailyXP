import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onEdit?: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onComplete,
  onEdit,
}) => {
  const scaleValue = new Animated.Value(1);
  const [isCompleted, setIsCompleted] = React.useState(habit.isCompleted);

  const handlePress = () => {
    if (isCompleted) return;

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setIsCompleted(true);
    onComplete(habit.id);
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleValue }] }}
      className={`bg-white rounded-xl p-4 mb-3 shadow-sm border-l-4 ${
        isCompleted ? 'border-green-500 bg-green-50' : 'border-blue-500'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">{habit.emoji}</Text>
          <View className="flex-1">
            <Text className={`font-semibold text-lg ${
              isCompleted ? 'text-green-700 line-through' : 'text-gray-800'
            }`}>
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

        <TouchableOpacity
          onPress={handlePress}
          disabled={isCompleted}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isCompleted ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white text-xl">
            {isCompleted ? '✓' : '+'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};