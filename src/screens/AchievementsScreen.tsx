import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../services/achievementService';

const { width } = Dimensions.get('window');

export const AchievementsScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userAchievements = user?.achievements || [];

  const getAchievementStatus = (achievement: Achievement) => {
    const userAchievement = userAchievements.find(a => a.id === achievement.id);
    return userAchievement?.isUnlocked || false;
  };

  const groupedAchievements = ACHIEVEMENTS.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {} as { [key: string]: Achievement[] });

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'streak': return 'Streak Master';
      case 'completion': return 'Completion Champion';
      case 'level': return 'Level Legend';
      case 'special': return 'Special Achievements';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return '🔥';
      case 'completion': return '✅';
      case 'level': return '⭐';
      case 'special': return '✨';
      default: return '🏆';
    }
  };

  const unlockedCount = userAchievements.filter(a => a.isUnlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Achievements</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {unlockedCount} of {totalCount} unlocked
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedAchievements).map(([category, achievements]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
              <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>
            </View>

            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => {
                const isUnlocked = getAchievementStatus(achievement);
                return (
                  <TouchableOpacity
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      isUnlocked ? styles.achievementUnlocked : styles.achievementLocked,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.achievementIcon,
                      !isUnlocked && styles.lockedIcon
                    ]}>
                      {isUnlocked ? achievement.icon : '🔒'}
                    </Text>
                    <Text style={[
                      styles.achievementTitle,
                      !isUnlocked && styles.lockedText
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      !isUnlocked && styles.lockedText
                    ]}>
                      {achievement.description}
                    </Text>
                    <View style={styles.xpBadge}>
                      <Text style={styles.xpText}>+{achievement.xpReward} XP</Text>
                    </View>
                    {isUnlocked && (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedText}>✓ Unlocked</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Keep completing habits to unlock more achievements! 🚀
          </Text>
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
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.9,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  achievementUnlocked: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  lockedText: {
    opacity: 0.7,
  },
  xpBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  xpText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unlockedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
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