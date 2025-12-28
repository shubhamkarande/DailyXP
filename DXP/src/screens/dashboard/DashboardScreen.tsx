import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    RefreshControl,
    Dimensions,
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
    fetchSummary,
    completeHabit,
    Habit,
} from '../../store';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DashboardScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { habits, isLoading: habitsLoading } = useSelector((state: RootState) => state.habits);
    const { today } = useSelector((state: RootState) => state.progress);

    useEffect(() => {
        dispatch(fetchHabits());
        dispatch(fetchSummary());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchHabits());
        dispatch(fetchSummary());
    };

    const handleCompleteHabit = (habitId: string) => {
        dispatch(completeHabit(habitId));
    };

    const xpForNextLevel = user ? Math.floor(100 * user.level * 1.2) : 100;
    const xpProgress = user ? (user.xp / xpForNextLevel) * 100 : 0;
    const xpToNextLevel = xpForNextLevel - (user?.xp || 0);

    // Filter incomplete habits for today's quests
    const todayHabits = habits.filter(h => h.frequency === 'daily').slice(0, 3);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={habitsLoading}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary.DEFAULT}
                    />
                }>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatar}>
                            <Icon name="person" size={20} color={colors.primary.DEFAULT} />
                        </View>
                        <View style={styles.onlineIndicator} />
                        <View style={styles.greeting}>
                            <Text style={styles.greetingSmall}>Welcome back</Text>
                            <Text style={styles.greetingName}>{user?.username || 'Hero'}!</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Icon name="notifications" size={24} color="#fff" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* Level & XP HUD */}
                <View style={styles.levelCard}>
                    <View style={styles.levelHeader}>
                        <Text style={styles.currentRankLabel}>CURRENT RANK</Text>
                        <Text style={styles.levelText}>
                            <Text style={styles.levelPrefix}>LVL</Text>
                            {user?.level || 1}
                        </Text>
                    </View>

                    <View style={styles.xpContainer}>
                        <View style={styles.xpHeader}>
                            <Text style={styles.xpLabel}>XP PROGRESS</Text>
                            <Text style={styles.xpText}>
                                {user?.xp || 0} <Text style={styles.xpMax}>/ {xpForNextLevel}</Text>
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${Math.min(xpProgress, 100)}%` }]} />
                        </View>
                        <Text style={styles.xpToNext}>{xpToNextLevel} XP to Level {(user?.level || 1) + 1}</Text>
                    </View>
                </View>

                {/* Today's Quests */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Today's Quests
                            <View style={styles.activeCount}>
                                <Text style={styles.activeCountText}>
                                    {habits.filter(h => !h.completedToday && h.frequency === 'daily').length} Active
                                </Text>
                            </View>
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Habits' })}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.questsList}>
                        {todayHabits.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Icon name="add-task" size={48} color={colors.surface.border} />
                                <Text style={styles.emptyStateText}>No quests yet</Text>
                                <TouchableOpacity
                                    style={styles.addFirstButton}
                                    onPress={() => navigation.navigate('CreateHabit')}>
                                    <Text style={styles.addFirstText}>Add your first quest</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            todayHabits.map(habit => (
                                <QuestCard
                                    key={habit._id}
                                    habit={habit}
                                    onComplete={() => handleCompleteHabit(habit._id)}
                                />
                            ))
                        )}
                    </View>
                </View>

                {/* Daily Summary */}
                {today && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryLeft}>
                            <Text style={styles.summaryLabel}>DAILY LOOT</Text>
                            <View style={styles.summaryXp}>
                                <Text style={styles.summaryXpValue}>+{today.xpEarned}</Text>
                                <Text style={styles.summaryXpLabel}>XP Earned</Text>
                            </View>
                        </View>
                        <View style={styles.summaryRight}>
                            <Text style={styles.perfectDayLabel}>PERFECT DAY</Text>
                            <View style={styles.perfectDayBars}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.perfectBar,
                                            i <= today.completedHabits && styles.perfectBarActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* Bottom spacer for tab bar */}
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

// Quest Card Component
interface QuestCardProps {
    habit: Habit;
    onComplete: () => void;
}

const QuestCard = ({ habit, onComplete }: QuestCardProps) => {
    const config = difficultyConfig[habit.difficulty];

    return (
        <View style={[styles.questCard, habit.completedToday && styles.questCardCompleted]}>
            <View style={[styles.questIcon, { backgroundColor: config.bgColor }]}>
                <Icon name={habit.icon || 'check-circle'} size={24} color={config.color} />
            </View>
            <View style={styles.questContent}>
                <Text style={[styles.questTitle, habit.completedToday && styles.questTitleCompleted]}>
                    {habit.title}
                </Text>
                <View style={styles.questMeta}>
                    <View style={[styles.difficultyBadge, { backgroundColor: config.bgColor }]}>
                        <Text style={[styles.difficultyText, { color: config.color }]}>
                            {config.label.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.questXp}>+{config.xp} XP</Text>
                    {habit.currentStreak > 0 && (
                        <View style={styles.streakBadge}>
                            <Icon name="local-fire-department" size={14} color={colors.accent.gold} />
                            <Text style={styles.streakText}>{habit.currentStreak}</Text>
                        </View>
                    )}
                </View>
            </View>
            <TouchableOpacity
                style={[styles.checkbox, habit.completedToday && styles.checkboxCompleted]}
                onPress={onComplete}
                disabled={habit.completedToday}>
                {habit.completedToday && <Icon name="check" size={18} color="#fff" />}
            </TouchableOpacity>
        </View>
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
        paddingHorizontal: 24,
        paddingTop: 16,
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
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 32,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.accent.green,
        borderWidth: 2,
        borderColor: colors.background.dark,
    },
    greeting: {
        marginLeft: 4,
    },
    greetingSmall: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    greetingName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(45, 31, 59, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary.DEFAULT,
    },
    levelCard: {
        marginHorizontal: 24,
        marginTop: 16,
        padding: 24,
        borderRadius: 24,
        backgroundColor: colors.card.dark,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    levelHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    currentRankLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.accent.gold,
        letterSpacing: 2,
        marginBottom: 4,
    },
    levelText: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fff',
    },
    levelPrefix: {
        fontSize: 24,
        opacity: 0.5,
        marginRight: 4,
    },
    xpContainer: {
        gap: 8,
    },
    xpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    xpLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text.muted,
        letterSpacing: 1,
    },
    xpText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    xpMax: {
        color: 'rgba(255, 255, 255, 0.4)',
    },
    progressBar: {
        height: 16,
        backgroundColor: 'rgba(26, 17, 34, 1)',
        borderRadius: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 8,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    xpToNext: {
        fontSize: 12,
        color: 'rgba(173, 146, 201, 0.7)',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeCount: {
        marginLeft: 8,
        backgroundColor: 'rgba(127, 19, 236, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(127, 19, 236, 0.3)',
    },
    activeCountText: {
        fontSize: 12,
        color: colors.primary.DEFAULT,
        fontWeight: '600',
    },
    viewAllText: {
        fontSize: 14,
        color: colors.text.muted,
        fontWeight: '500',
    },
    questsList: {
        gap: 12,
    },
    emptyState: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: colors.text.muted,
        marginTop: 12,
    },
    addFirstButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 20,
    },
    addFirstText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    questCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.card.dark,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        gap: 16,
    },
    questCardCompleted: {
        opacity: 0.6,
        backgroundColor: 'rgba(26, 17, 34, 0.5)',
    },
    questIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    questContent: {
        flex: 1,
        gap: 4,
    },
    questTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    questTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.text.muted,
    },
    questMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    difficultyBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '700',
    },
    questXp: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    streakText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.accent.gold,
    },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.surface.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    summaryCard: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: 24,
        padding: 16,
        backgroundColor: 'rgba(30, 30, 40, 1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    summaryLeft: {
        flex: 1,
        gap: 4,
    },
    summaryLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.text.muted,
        letterSpacing: 1,
    },
    summaryXp: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    summaryXpValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.accent.green,
    },
    summaryXpLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(74, 222, 128, 0.8)',
    },
    summaryRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    perfectDayLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text.muted,
        letterSpacing: 1,
    },
    perfectDayBars: {
        flexDirection: 'row',
        gap: 4,
    },
    perfectBar: {
        width: 6,
        height: 16,
        backgroundColor: 'rgba(74, 222, 128, 0.3)',
        borderRadius: 3,
    },
    perfectBarActive: {
        backgroundColor: colors.accent.green,
        shadowColor: colors.accent.green,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
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

export default DashboardScreen;
