import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HabitTemplate } from '../types';
import {
  HABIT_TEMPLATES,
  getTemplatesByCategory,
  getPopularTemplates,
  getCategories,
} from '../services/habitTemplates';

const { width } = Dimensions.get('window');

export const HabitTemplatesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Popular', 'All', ...getCategories()];

  const getFilteredTemplates = (): HabitTemplate[] => {
    let templates: HabitTemplate[] = [];

    if (selectedCategory === 'Popular') {
      templates = getPopularTemplates();
    } else if (selectedCategory === 'All') {
      templates = HABIT_TEMPLATES;
    } else {
      templates = getTemplatesByCategory(selectedCategory);
    }

    if (searchQuery) {
      templates = templates.filter(
        template =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return templates;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getDifficultyXP = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 15;
      case 'medium':
        return 25;
      case 'hard':
        return 40;
      default:
        return 20;
    }
  };

  const handleSelectTemplate = (template: HabitTemplate) => {
    // Navigate to habit editor with template data
    navigation.navigate('HabitEditor', {
      habit: {
        id: '',
        title: template.title,
        category: template.category,
        emoji: template.emoji,
        xpValue: getDifficultyXP(template.difficulty),
        difficulty: template.difficulty,
        streak: 0,
        createdAt: new Date(),
        isCompleted: false,
        reminderTime: undefined,
        isActive: true,
        completionHistory: [],
        bestStreak: 0,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>✨ Habit Templates</Text>
        <Text style={styles.subtitle}>
          Choose from popular habits or create your own
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category &&
                  styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Templates */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.templatesGrid}>
          {getFilteredTemplates().map(template => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleSelectTemplate(template)}
              activeOpacity={0.8}
            >
              <View style={styles.templateHeader}>
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor: getDifficultyColor(template.difficulty),
                    },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {template.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateCategory}>{template.category}</Text>
              <Text style={styles.templateDescription}>
                {template.description}
              </Text>

              <View style={styles.templateFooter}>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>
                    +{getDifficultyXP(template.difficulty)} XP
                  </Text>
                </View>
                {template.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>🔥 Popular</Text>
                  </View>
                )}
              </View>

              {/* Tips Preview */}
              {template.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsTitle}>💡 Quick Tip:</Text>
                  <Text style={styles.tipText}>{template.tips[0]}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {getFilteredTemplates().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No habits found for "{searchQuery || selectedCategory}"
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Try a different search term or category
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createCustomButton}
            onPress={() => navigation.navigate('HabitEditor')}
          >
            <Text style={styles.createCustomButtonText}>
              + Create Custom Habit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#10B981',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateEmoji: {
    fontSize: 32,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 20,
  },
  templateCategory: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 12,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  popularBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    color: '#d97706',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tipsContainer: {
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  tipsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 11,
    color: '#065f46',
    lineHeight: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  createCustomButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createCustomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
