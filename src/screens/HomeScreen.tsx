import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { XPMeter } from '../components/XPMeter';
import { HabitCard } from '../components/HabitCard';
import { RewardModal } from '../components/RewardModal';
import { FirebaseService } from '../services/firebase';
import { setUserProfile, addXP } from '../store/slices/userSlice';
import { setHabits, completeHabit } from '../store/slices/habitSlice';
import { XPReward } from '../types';

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);
  const { habits } = useSelector((state: RootState) => state.habits);
  
  const [refreshing, setRefreshing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState<XPReward>({ amount: 0, levelUp: false });

  useEffect(() => {
    if (user?.uid) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.uid) return;
    
    try {
      const userProfile = await FirebaseService.getUserProfile(user.uid);
      if (userProfile) {
        dispatch(setUserProfile(userProfile));
        dispatch(setHabits(userProfile.habits));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleCompleteHabit = async (habitId: string) => {
    if (!user?.uid || !profile) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.isCompleted) return;

    const oldLevel = profile.level;
    
    try {
      await FirebaseService.completeHabit(user.uid, habitId, habit.xpValue);
      dispatch(completeHabit(habitId));
      dispatch(addXP(habit.xpValue));

      const newLevel = Math.floor((profile.totalXP + habit.xpValue) / 100) + 1;
      const levelUp = newLevel > oldLevel;

      setCurrentReward({
        amount: habit.xpValue,
        levelUp,
        newLevel: levelUp ? newLevel : undefined,
      });
      setShowReward(true);
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const todaysHabits = habits.filter(habit => {
    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
    return lastCompleted !== today;
  });

  const completedToday = habits.filter(habit => {
    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
    return lastCompleted === today;
  });

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {profile && (
          <XPMeter
            currentXP={profile.currentLevelXP}
            maxXP={profile.nextLevelXP}
            level={profile.level}
          />
        )}

        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Today's Habits
          </Text>
          
          {todaysHabits.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Text className="text-6xl mb-2">🎉</Text>
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                All done for today!
              </Text>
              <Text className="text-gray-600 text-center">
                Great job completing all your habits
              </Text>
            </View>
          ) : (
            todaysHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={handleCompleteHabit}
              />
            ))
          )}
        </View>

        {completedToday.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Completed Today ✓
            </Text>
            {completedToday.map(habit => (
              <HabitCard
                key={habit.id}
                habit={{ ...habit, isCompleted: true }}
                onComplete={() => {}}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <RewardModal
        visible={showReward}
        reward={currentReward}
        onClose={() => setShowReward(false)}
      />
    </View>
  );
};