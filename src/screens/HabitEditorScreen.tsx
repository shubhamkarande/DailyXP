import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { RootState } from '../store';
import { addHabit, updateHabit, deleteHabit } from '../store/slices/habitSlice';
import { FirebaseService } from '../services/firebase';
import { Habit } from '../types';

const CATEGORIES = [
  { name: 'Health', emoji: '💪' },
  { name: 'Learning', emoji: '📚' },
  { name: 'Productivity', emoji: '⚡' },
  { name: 'Mindfulness', emoji: '🧘' },
  { name: 'Social', emoji: '👥' },
  { name: 'Creative', emoji: '🎨' },
  { name: 'Finance', emoji: '💰' },
  { name: 'Other', emoji: '📝' },
];

const XP_VALUES = [10, 20, 30, 50];

export const HabitEditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const editingHabit = (route.params as any)?.habit as Habit | undefined;
  const isEditing = !!editingHabit;

  const [title, setTitle] = useState(editingHabit?.title || '');
  const [selectedCategory, setSelectedCategory] = useState(
    editingHabit?.category || 'Health'
  );
  const [selectedXP, setSelectedXP] = useState(editingHabit?.xpValue || 20);
  const [loading, setLoading] = useState(false);

  const selectedCategoryEmoji = CATEGORIES.find(c => c.name === selectedCategory)?.emoji || '📝';

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    if (!user?.uid) return;

    setLoading(true);

    try {
      const habitData: Habit = {
        id: editingHabit?.id || Date.now().toString(),
        title: title.trim(),
        category: selectedCategory,
        emoji: selectedCategoryEmoji,
        xpValue: selectedXP,
        streak: editingHabit?.streak || 0,
        lastCompleted: editingHabit?.lastCompleted,
        createdAt: editingHabit?.createdAt || new Date(),
        isCompleted: false,
      };

      if (isEditing) {
        await FirebaseService.updateHabit(user.uid, habitData);
        dispatch(updateHabit(habitData));
      } else {
        await FirebaseService.addHabit(user.uid, habitData);
        dispatch(addHabit(habitData));
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Error', 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!editingHabit || !user?.uid) return;

    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FirebaseService.deleteHabit(user.uid, editingHabit.id);
              dispatch(deleteHabit(editingHabit.id));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting habit:', error);
              Alert.alert('Error', 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Edit Habit' : 'New Habit'}
      </Text>

      {/* Title Input */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Habit Title</Text>
        <TextInput
          className="bg-white rounded-xl p-4 text-gray-800 shadow-sm"
          placeholder="e.g., Drink 8 glasses of water"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />
      </View>

      {/* Category Selection */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Category</Text>
        <View className="flex-row flex-wrap">
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.name}
              onPress={() => setSelectedCategory(category.name)}
              className={`flex-row items-center p-3 m-1 rounded-xl ${
                selectedCategory === category.name
                  ? 'bg-blue-500'
                  : 'bg-white'
              } shadow-sm`}
            >
              <Text className="text-lg mr-2">{category.emoji}</Text>
              <Text className={`font-medium ${
                selectedCategory === category.name
                  ? 'text-white'
                  : 'text-gray-800'
              }`}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* XP Value Selection */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-800 mb-3">XP Reward</Text>
        <View className="flex-row justify-between">
          {XP_VALUES.map(xp => (
            <TouchableOpacity
              key={xp}
              onPress={() => setSelectedXP(xp)}
              className={`flex-1 items-center p-4 mx-1 rounded-xl ${
                selectedXP === xp ? 'bg-green-500' : 'bg-white'
              } shadow-sm`}
            >
              <Text className={`text-xl font-bold ${
                selectedXP === xp ? 'text-white' : 'text-green-600'
              }`}>
                +{xp}
              </Text>
              <Text className={`text-sm ${
                selectedXP === xp ? 'text-white' : 'text-gray-600'
              }`}>
                XP
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        className="mb-4"
      >
        <LinearGradient
          colors={['#10B981', '#059669']}
          className="py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">
            {loading ? 'Saving...' : isEditing ? 'Update Habit' : 'Create Habit'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          onPress={handleDelete}
          className="py-4 rounded-xl items-center bg-red-500 mb-6"
        >
          <Text className="text-white font-semibold text-lg">Delete Habit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};