import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { RootState, AppDispatch, fetchChartData, fetchStreaks } from '../../store';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { chartData, streaks } = useSelector((state: RootState) => state.progress);
    const { habits } = useSelector((state: RootState) => state.habits);

    useEffect(() => {
        dispatch(fetchChartData(7));
        dispatch(fetchStreaks());
    }, [dispatch]);

    const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);
    const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
    const maxChartXp = Math.max(...chartData.map(d => d.xp), 50);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Progress Stats</Text>
                    <Text style={styles.subtitle}>Track your XP journey</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: 'rgba(127, 19, 236, 0.2)' }]}>
                            <Icon name="bolt" size={24} color={colors.primary.DEFAULT} />
                        </View>
                        <Text style={styles.statValue}>{user?.totalXpEarned || 0}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 159, 28, 0.2)' }]}>
                            <Icon name="local-fire-department" size={24} color={colors.accent.orange} />
                        </View>
                        <Text style={styles.statValue}>{longestStreak}</Text>
                        <Text style={styles.statLabel}>Best Streak</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: 'rgba(74, 222, 128, 0.2)' }]}>
                            <Icon name="check-circle" size={24} color={colors.accent.green} />
                        </View>
                        <Text style={styles.statValue}>{totalCompletions}</Text>
                        <Text style={styles.statLabel}>Completions</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: 'rgba(251, 191, 36, 0.2)' }]}>
                            <Icon name="emoji-events" size={24} color={colors.accent.gold} />
                        </View>
                        <Text style={styles.statValue}>{user?.level || 1}</Text>
                        <Text style={styles.statLabel}>Level</Text>
                    </View>
                </View>

                {/* XP Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Weekly XP</Text>
                    <View style={styles.chartContainer}>
                        {chartData.map((day, index) => (
                            <View key={index} style={styles.chartBar}>
                                <View style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${Math.max((day.xp / maxChartXp) * 100, 5)}%`,
                                                backgroundColor:
                                                    day.xp > 0 ? colors.primary.DEFAULT : colors.surface.border,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel}>{day.dayName}</Text>
                                {day.xp > 0 && <Text style={styles.barXp}>+{day.xp}</Text>}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Streak Overview */}
                <View style={styles.streaksCard}>
                    <Text style={styles.streaksTitle}>Active Streaks</Text>
                    {streaks.length === 0 ? (
                        <Text style={styles.emptyText}>No active streaks yet</Text>
                    ) : (
                        streaks.slice(0, 5).map((streak, index) => (
                            <View key={index} style={styles.streakItem}>
                                <View style={styles.streakInfo}>
                                    <Icon
                                        name={streak.icon || 'check-circle'}
                                        size={20}
                                        color={colors.primary.DEFAULT}
                                    />
                                    <Text style={styles.streakName}>{streak.title}</Text>
                                </View>
                                <View style={styles.streakValue}>
                                    <Icon
                                        name="local-fire-department"
                                        size={16}
                                        color={streak.currentStreak > 0 ? colors.accent.orange : colors.text.muted}
                                    />
                                    <Text
                                        style={[
                                            styles.streakCount,
                                            streak.currentStreak > 0 && styles.streakCountActive,
                                        ]}>
                                        {streak.currentStreak}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Bottom spacer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },
    content: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.muted,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    statCard: {
        width: (width - 44) / 2,
        padding: 20,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
        alignItems: 'center',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 4,
        fontWeight: '500',
    },
    chartCard: {
        marginHorizontal: 16,
        marginTop: 24,
        padding: 20,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 150,
        alignItems: 'flex-end',
    },
    chartBar: {
        alignItems: 'center',
        flex: 1,
    },
    barContainer: {
        height: 100,
        width: 24,
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    bar: {
        width: '100%',
        borderRadius: 4,
        minHeight: 8,
    },
    barLabel: {
        fontSize: 10,
        color: colors.text.muted,
        fontWeight: '600',
    },
    barXp: {
        fontSize: 10,
        color: colors.primary.DEFAULT,
        fontWeight: '700',
        marginTop: 4,
    },
    streaksCard: {
        marginHorizontal: 16,
        marginTop: 24,
        padding: 20,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
    },
    streaksTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    emptyText: {
        color: colors.text.muted,
        textAlign: 'center',
        paddingVertical: 20,
    },
    streakItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
    },
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    streakName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    streakValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streakCount: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.muted,
    },
    streakCountActive: {
        color: colors.accent.orange,
    },
    bottomSpacer: {
        height: 40,
    },
});

export default StatsScreen;
