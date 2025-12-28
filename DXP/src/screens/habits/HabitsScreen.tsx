import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, difficultyConfig } from '../../theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import {
    RootState,
    AppDispatch,
    fetchHabits,
    completeHabit,
    Habit,
} from '../../store';

type NavigationProp = StackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'daily' | 'weekly';

const HabitsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { habits, isLoading } = useSelector((state: RootState) => state.habits);

    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        dispatch(fetchHabits());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchHabits());
    };

    const handleCompleteHabit = (habitId: string) => {
        dispatch(completeHabit(habitId));
    };

    const filteredHabits = habits.filter(h => {
        if (filter === 'all') return true;
        return h.frequency === filter;
    });

    const xpForNextLevel = user ? Math.floor(100 * user.level * 1.2) : 100;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary.DEFAULT}
                    />
                }>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatar}>
                            <Icon name="person" size={20} color={colors.primary.DEFAULT} />
                            <View style={styles.levelBadge}>
                                <Text style={styles.levelBadgeText}>Lvl {user?.level || 1}</Text>
                            </View>
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle}>Daily Quests</Text>
                            <Text style={styles.headerSubtitle}>Keep the streak alive!</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Icon name="notifications" size={20} color="#fff" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* XP Progress */}
                <View style={styles.xpSection}>
                    <View style={styles.xpHeader}>
                        <Text style={styles.xpLabel}>LEVEL {user?.level || 1}</Text>
                        <Text style={styles.xpValue}>
                            {user?.xp || 0} / {xpForNextLevel} XP
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${Math.min(((user?.xp || 0) / xpForNextLevel) * 100, 100)}%` },
                            ]}
                        />
                    </View>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
                        onPress={() => setFilter('all')}>
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === 'daily' && styles.filterChipActive]}
                        onPress={() => setFilter('daily')}>
                        <Text style={[styles.filterText, filter === 'daily' && styles.filterTextActive]}>
                            Daily
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, filter === 'weekly' && styles.filterChipActive]}
                        onPress={() => setFilter('weekly')}>
                        <Text style={[styles.filterText, filter === 'weekly' && styles.filterTextActive]}>
                            Weekly
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Habits List */}
                <View style={styles.habitsList}>
                    {filteredHabits.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon name="add-task" size={64} color={colors.surface.border} />
                            <Text style={styles.emptyTitle}>No quests found</Text>
                            <Text style={styles.emptySubtitle}>
                                Create your first quest to start earning XP
                            </Text>
                        </View>
                    ) : (
                        filteredHabits.map(habit => (
                            <HabitCard
                                key={habit._id}
                                habit={habit}
                                onComplete={() => handleCompleteHabit(habit._id)}
                            />
                        ))
                    )}
                </View>

                {/* Bottom spacer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateHabit')}
                activeOpacity={0.8}>
                <Icon name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

// Habit Card Component
interface HabitCardProps {
    habit: Habit;
    onComplete: () => void;
}

const HabitCard = ({ habit, onComplete }: HabitCardProps) => {
    const config = difficultyConfig[habit.difficulty];

    return (
        <TouchableOpacity
            style={[styles.habitCard, habit.completedToday && styles.habitCardCompleted]}
            activeOpacity={0.8}>
            <View style={[styles.habitIcon, { backgroundColor: config.bgColor }]}>
                <Icon name={habit.icon || 'check-circle'} size={24} color={config.color} />
            </View>
            <View style={styles.habitContent}>
                <Text style={[styles.habitTitle, habit.completedToday && styles.habitTitleCompleted]}>
                    {habit.title}
                </Text>
                <View style={styles.habitMeta}>
                    {habit.currentStreak > 0 ? (
                        <View style={styles.streakContainer}>
                            <Icon name="local-fire-department" size={14} color={colors.accent.orange} />
                            <Text style={styles.streakText}>{habit.currentStreak} Streak</Text>
                        </View>
                    ) : (
                        <Text style={styles.frequencyText}>
                            {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                        </Text>
                    )}
                    <View style={styles.dot} />
                    <View style={[styles.difficultyBadge, { backgroundColor: config.bgColor }]}>
                        <Text style={[styles.difficultyText, { color: config.color }]}>
                            {config.label}
                        </Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={[styles.checkbox, habit.completedToday && styles.checkboxCompleted]}
                onPress={onComplete}
                disabled={habit.completedToday}>
                {habit.completedToday && <Icon name="check" size={18} color="#fff" />}
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(127, 19, 236, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary.DEFAULT,
    },
    levelBadge: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        backgroundColor: colors.primary.DEFAULT,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.background.dark,
    },
    levelBadgeText: {
        fontSize: 8,
        fontWeight: '700',
        color: '#fff',
    },
    headerText: {},
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 2,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.card.dark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accent.red,
        borderWidth: 2,
        borderColor: colors.card.dark,
    },
    xpSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 8,
    },
    xpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    xpLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
        letterSpacing: 1,
    },
    xpValue: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
    },
    progressBar: {
        height: 12,
        backgroundColor: colors.card.dark,
        borderRadius: 6,
        overflow: 'hidden',
        padding: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 4,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    filterScroll: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    filterContainer: {
        gap: 12,
    },
    filterChip: {
        paddingHorizontal: 20,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.card.dark,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: colors.primary.DEFAULT,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.muted,
    },
    filterTextActive: {
        color: '#fff',
    },
    habitsList: {
        paddingHorizontal: 20,
        paddingTop: 8,
        gap: 16,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.text.muted,
        marginTop: 4,
        textAlign: 'center',
    },
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.card.dark,
        borderRadius: 16,
        gap: 16,
    },
    habitCardCompleted: {
        opacity: 0.6,
        backgroundColor: 'rgba(42, 27, 56, 0.4)',
    },
    habitIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    habitContent: {
        flex: 1,
        gap: 4,
    },
    habitTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    habitTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.text.muted,
    },
    habitMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streakText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.accent.orange,
    },
    frequencyText: {
        fontSize: 12,
        color: colors.text.muted,
        fontWeight: '500',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.surface.border,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.surface.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    bottomSpacer: {
        height: 40,
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
});

export default HabitsScreen;
