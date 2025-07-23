import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { RootState } from '../store';
import { addHabit } from '../store/slices/habitSlice';
import { FirebaseService } from '../services/firebase';
import { Habit } from '../types';

const STARTER_HABITS = [
  { title: 'Drink 8 glasses of water', category: 'Health', emoji: '💧', xpValue: 20 },
  { title: 'Read for 30 minutes', category: 'Learning', emoji: '📚', xpValue: 30 },
  { title: 'Exercise for 20 minutes', category: 'Health', emoji: '💪', xpValue: 30 },
  { title: 'Meditate for 10 minutes', category: 'Mindfulness', emoji: '🧘', xpValue: 25 },
  { title: 'Write in journal', category: 'Mindfulness', emoji: '📝', xpValue: 15 },
  { title: 'Take a walk outside', category: 'Health', emoji: '🚶', xpValue: 20 },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleHabit = (habitTitle: string) => {
    setSelectedHabits(prev => {
      if (prev.includes(habitTitle)) {
        return prev.filter(h => h !== habitTitle);
      } else if (prev.length < 3) {
        return [...prev, habitTitle];
      }
      return prev;
    });
  };

  const handleComplete = async () => {
    if (selectedHabits.length !== 3) {
      Alert.alert('Please select exactly 3 habits to get started!');
      return;
    }

    if (!user?.uid) return;

    setLoading(true);

    try {
      const habitsToAdd = STARTER_HABITS
        .filter(h => selectedHabits.includes(h.title))
        .map(h => ({
          id: Date.now().toString() + Math.random().toString(),
          title: h.title,
          category: h.category,
          emoji: h.emoji,
          xpValue: h.xpValue,
          streak: 0,
          createdAt: new Date(),
          isCompleted: false,
        } as Habit));

      for (const habit of habitsToAdd) {
        await FirebaseService.addHabit(user.uid, habit);
        dispatch(addHabit(habit));
      }

      navigation.navigate('Main' as never);
    } catch (error) {
      console.error('Error adding starter habits:', error);
      Alert.alert('Error', 'Failed to create starter habits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 px-6 pt-12">
        <View className="items-center mb-8">
          <Text className="text-4xl mb-4">🎮</Text>
          <Text className="text-3xl font-bold text-white text-center mb-2">
            Welcome to DailyXP!
          </Text>
          <Text className="text-lg text-white/80 text-center">
            Choose 3 starter habits to begin your journey
          </Text>
        </View>

        <View className="mb-8">
          {STARTER_HABITS.map(habit => (
            <TouchableOpacity
              key={habit.title}
              onPress={() => toggleHabit(habit.title)}
              className={`flex-row items-center p-4 mb-3 rounded-xl ${
                selectedHabits.includes(habit.title)
                  ? 'bg-white'
                  : 'bg-white/20'
              }`}
            >
              <Text className="text-2xl mr-3">{habit.emoji}</Text>
              <View className="flex-1">
                <Text className={`font-semibold text-lg ${
                  selectedHabits.includes(habit.title)
                    ? 'text-gray-800'
                    : 'text-white'
                }`}>
                  {habit.title}
                </Text>
                <Text className={`text-sm ${
                  selectedHabits.includes(habit.title)
                    ? 'text-gray-600'
                    : 'text-white/70'
                }`}>
                  {habit.category} • +{habit.xpValue} XP
                </Text>
              </View>
              <View className={`w-6 h-6 rounded-full border-2 ${
                selectedHabits.includes(habit.title)
                  ? 'bg-green-500 border-green-500'
                  : 'border-white'
              } items-center justify-center`}>
                {selectedHabits.includes(habit.title) && (
                  <Text className="text-white text-sm">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-center text-white/70 mb-6">
          Selected: {selectedHabits.length}/3 habits
        </Text>

        <TouchableOpacity
          onPress={handleComplete}
          disabled={loading || selectedHabits.length !== 3}
          className="mb-8"
        >
          <LinearGradient
            colors={selectedHabits.length === 3 ? ['#10B981', '#059669'] : ['#6B7280', '#4B5563']}
            className="py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? 'Creating Habits...' : 'Start My Journey!'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};