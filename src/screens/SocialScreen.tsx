import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Friend {
  id: string;
  displayName: string;
  level: number;
  totalXP: number;
  avatar: string;
  isOnline: boolean;
  currentStreak: number;
}

interface LeaderboardEntry {
  id: string;
  displayName: string;
  level: number;
  totalXP: number;
  avatar: string;
  weeklyXP: number;
  rank: number;
}

export const SocialScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard' | 'challenges'>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from Firebase
  const friends: Friend[] = [
    {
      id: '1',
      displayName: 'Alex Johnson',
      level: 12,
      totalXP: 1250,
      avatar: '👨‍💻',
      isOnline: true,
      currentStreak: 15,
    },
    {
      id: '2',
      displayName: 'Sarah Chen',
      level: 8,
      totalXP: 780,
      avatar: '👩‍🎨',
      isOnline: false,
      currentStreak: 7,
    },
    {
      id: '3',
      displayName: 'Mike Wilson',
      level: 15,
      totalXP: 1580,
      avatar: '🧑‍🚀',
      isOnline: true,
      currentStreak: 23,
    },
  ];

  const leaderboard: LeaderboardEntry[] = [
    {
      id: '3',
      displayName: 'Mike Wilson',
      level: 15,
      totalXP: 1580,
      avatar: '🧑‍🚀',
      weeklyXP: 280,
      rank: 1,
    },
    {
      id: '1',
      displayName: 'Alex Johnson',
      level: 12,
      totalXP: 1250,
      avatar: '👨‍💻',
      weeklyXP: 220,
      rank: 2,
    },
    {
      id: 'user',
      displayName: user?.displayName || 'You',
      level: user?.level || 5,
      totalXP: user?.totalXP || 500,
      avatar: '🎮',
      weeklyXP: 180,
      rank: 3,
    },
    {
      id: '2',
      displayName: 'Sarah Chen',
      level: 8,
      totalXP: 780,
      avatar: '👩‍🎨',
      weeklyXP: 150,
      rank: 4,
    },
  ];

  const challenges = [
    {
      id: '1',
      title: '7-Day Streak Challenge',
      description: 'Complete all habits for 7 consecutive days',
      participants: 12,
      timeLeft: '3 days',
      reward: '500 XP',
      icon: '🔥',
    },
    {
      id: '2',
      title: 'Early Bird Challenge',
      description: 'Complete a habit before 8 AM for 5 days',
      participants: 8,
      timeLeft: '1 week',
      reward: '300 XP',
      icon: '🐦',
    },
    {
      id: '3',
      title: 'Fitness Focus',
      description: 'Complete 10 fitness-related habits this week',
      participants: 15,
      timeLeft: '5 days',
      reward: '400 XP',
      icon: '💪',
    },
  ];

  const handleAddFriend = () => {
    Alert.alert(
      'Add Friend',
      'Enter your friend\'s email or username',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Request', onPress: () => console.log('Friend request sent') },
      ]
    );
  };

  const handleJoinChallenge = (challengeId: string) => {
    Alert.alert(
      'Join Challenge',
      'Are you sure you want to join this challenge?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join', onPress: () => console.log('Joined challenge:', challengeId) },
      ]
    );
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <Text style={styles.friendAvatar}>{item.avatar}</Text>
        <View style={styles.friendDetails}>
          <View style={styles.friendHeader}>
            <Text style={styles.friendName}>{item.displayName}</Text>
            <View style={[styles.onlineIndicator, { backgroundColor: item.isOnline ? '#10B981' : '#9ca3af' }]} />
          </View>
          <Text style={styles.friendLevel}>Level {item.level} • {item.totalXP} XP</Text>
          <Text style={styles.friendStreak}>🔥 {item.currentStreak} day streak</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>Challenge</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => (
    <View style={[styles.leaderboardCard, item.id === 'user' && styles.userCard]}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>#{item.rank}</Text>
        {item.rank <= 3 && (
          <Text style={styles.medal}>
            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
          </Text>
        )}
      </View>
      <Text style={styles.leaderboardAvatar}>{item.avatar}</Text>
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{item.displayName}</Text>
        <Text style={styles.leaderboardLevel}>Level {item.level}</Text>
        <Text style={styles.weeklyXP}>+{item.weeklyXP} XP this week</Text>
      </View>
      <Text style={styles.totalXP}>{item.totalXP} XP</Text>
    </View>
  );

  const renderChallenge = (challenge: any) => (
    <View key={challenge.id} style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeIcon}>{challenge.icon}</Text>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
        </View>
      </View>
      <View style={styles.challengeStats}>
        <Text style={styles.challengeParticipants}>👥 {challenge.participants} joined</Text>
        <Text style={styles.challengeTimeLeft}>⏰ {challenge.timeLeft} left</Text>
        <Text style={styles.challengeReward}>🏆 {challenge.reward}</Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => handleJoinChallenge(challenge.id)}
      >
        <Text style={styles.joinButtonText}>Join Challenge</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>👥 Social</Text>
        <Text style={styles.subtitle}>Connect with friends and compete</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'friends', label: 'Friends', icon: '👥' },
          { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
          { key: 'challenges', label: 'Challenges', icon: '⚡' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'friends' && (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
                <Text style={styles.addButtonText}>+ Add Friend</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={friends.filter(friend =>
                friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              renderItem={renderFriend}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        )}

        {activeTab === 'leaderboard' && (
          <>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.leaderboardTitle}>🏆 Weekly Leaderboard</Text>
              <Text style={styles.leaderboardSubtitle}>Top performers this week</Text>
            </View>

            <FlatList
              data={leaderboard}
              renderItem={renderLeaderboardEntry}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        )}

        {activeTab === 'challenges' && (
          <>
            <View style={styles.challengesHeader}>
              <Text style={styles.challengesTitle}>⚡ Active Challenges</Text>
              <Text style={styles.challengesSubtitle}>Join challenges to earn bonus XP</Text>
            </View>

            {challenges.map(renderChallenge)}
          </>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#10B981',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  friendCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  friendDetails: {
    flex: 1,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  friendLevel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  friendStreak: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  challengeButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  challengeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  leaderboardHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  leaderboardCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userCard: {
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#f0fdf4',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  medal: {
    fontSize: 16,
    marginTop: 2,
  },
  leaderboardAvatar: {
    fontSize: 28,
    marginRight: 16,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  leaderboardLevel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  weeklyXP: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  totalXP: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  challengesHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  challengesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  challengesSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  challengeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  challengeStats: {
    marginBottom: 16,
  },
  challengeParticipants: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  challengeTimeLeft: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
    marginBottom: 4,
  },
  challengeReward: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});