import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addHabit, updateHabit, deleteHabit } from '../store/slices/habitsSlice';
import { Habit } from '../types';

export const HabitEditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const existingHabit = (route.params as any)?.habit;
  const isEditing = !!existingHabit;

  const [title, setTitle] = useState(existingHabit?.title || '');
  const [emoji, setEmoji] = useState(existingHabit?.emoji || '⭐');
  const [category, setCategory] = useState(existingHabit?.category || 'General');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    existingHabit?.difficulty || 'medium'
  );
  const [reminderTime, setReminderTime] = useState(existingHabit?.reminderTime || '');

  const categories = ['Health', 'Fitness', 'Learning', 'Mindfulness', 'Productivity', 'Social', 'Creative', 'General'];
  const emojis = ['⭐', '💧', '💪', '📚', '🧘', '📝', '🏃', '🎯', '🌱', '🔥', '⚡', '🎨', '🎵', '🍎', '💤', '📱'];
  
  const getDifficultyXP = (diff: string) => {
    switch (diff) {
      case 'easy': return 15;
      case 'medium': return 25;
      case 'hard': return 40;
      default: return 25;
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    const habitData: Habit = {
      id: existingHabit?.id || Date.now().toString(),
      title: title.trim(),
      emoji,
      category,
      difficulty,
      xpValue: getDifficultyXP(difficulty),
      streak: existingHabit?.streak || 0,
      bestStreak: existingHabit?.bestStreak || 0,
      isCompleted: existingHabit?.isCompleted || false,
      isActive: existingHabit?.isActive ?? true,
      createdAt: existingHabit?.createdAt || new Date(),
      completionHistory: existingHabit?.completionHistory || [],
      reminderTime: reminderTime || undefined,
    };

    if (isEditing) {
      dispatch(updateHabit(habitData));
      Alert.alert('Success', 'Habit updated successfully!');
    } else {
      dispatch(addHabit(habitData));
      Alert.alert('Success', 'Habit created successfully!');
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existingHabit) return;

    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteHabit(existingHabit.id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Habit Title</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Drink 8 glasses of water"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Emoji Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Choose an Emoji</Text>
          <View style={styles.emojiGrid}>
            {emojis.map((emojiOption) => (
              <TouchableOpacity
                key={emojiOption}
                style={[
                  styles.emojiButton,
                  emoji === emojiOption && styles.selectedEmoji,
                ]}
                onPress={() => setEmoji(emojiOption)}
              >
                <Text style={styles.emojiText}>{emojiOption}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.selectedCategory,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat && styles.selectedCategoryText,
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  difficulty === diff && styles.selectedDifficulty,
                ]}
                onPress={() => setDifficulty(diff)}
              >
                <Text style={[
                  styles.difficultyText,
                  difficulty === diff && styles.selectedDifficultyText,
                ]}>
                  {diff.toUpperCase()}
                </Text>
                <Text style={[
                  styles.difficultyXP,
                  difficulty === diff && styles.selectedDifficultyText,
                ]}>
                  +{getDifficultyXP(diff)} XP
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reminder Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Reminder Time (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={reminderTime}
            onChangeText={setReminderTime}
            placeholder="e.g., 09:00"
            placeholderTextColor="#9ca3af"
          />
          <Text style={styles.helperText}>
            Format: HH:MM (24-hour format)
          </Text>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.label}>Preview</Text>
          <View style={styles.previewCard}>
            <Text style={styles.previewEmoji}>{emoji}</Text>
            <View style={styles.previewInfo}>
              <Text style={styles.previewTitle}>{title || 'Your habit title'}</Text>
              <Text style={styles.previewCategory}>{category}</Text>
              <Text style={styles.previewXP}>+{getDifficultyXP(difficulty)} XP</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Habit' : 'Create Habit'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Habit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiButton: {
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
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedDifficulty: {
    borderColor: '#10B981',
    backgroundColor: '#f0fdf4',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  difficultyXP: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  selectedDifficultyText: {
    color: '#10B981',
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 2,
  },
  previewXP: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  actionButtons: {
    padding: 20,
    paddingTop: 0,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});