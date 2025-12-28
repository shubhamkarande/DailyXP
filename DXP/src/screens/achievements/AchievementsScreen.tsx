import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { RootState, AppDispatch } from '../../store';
import { fetchAchievements } from '../../store/achievementsSlice';
import { AchievementCard } from '../../components/AchievementBadge';

const AchievementsScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { achievements, stats, isLoading } = useSelector(
        (state: RootState) => state.achievements,
    );

    useEffect(() => {
        dispatch(fetchAchievements());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchAchievements());
    };

    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
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
                    <Text style={styles.title}>Achievements</Text>
                    <Text style={styles.subtitle}>Collect badges as you progress</Text>
                </View>

                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressLeft}>
                        <View style={styles.progressIcon}>
                            <Icon name="emoji-events" size={32} color={colors.accent.gold} />
                        </View>
                    </View>
                    <View style={styles.progressRight}>
                        <Text style={styles.progressLabel}>BADGES COLLECTED</Text>
                        <Text style={styles.progressValue}>
                            {stats.unlocked} <Text style={styles.progressTotal}>/ {stats.total}</Text>
                        </Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[styles.progressFill, { width: `${stats.progress}%` }]}
                            />
                        </View>
                    </View>
                </View>

                {/* Unlocked Achievements */}
                {unlockedAchievements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Icon name="check-circle" size={18} color={colors.accent.green} /> Unlocked
                        </Text>
                        <View style={styles.achievementsList}>
                            {unlockedAchievements.map(achievement => (
                                <AchievementCard key={achievement.id} achievement={achievement} />
                            ))}
                        </View>
                    </View>
                )}

                {/* Locked Achievements */}
                {lockedAchievements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Icon name="lock" size={18} color={colors.text.muted} /> Locked
                        </Text>
                        <View style={styles.achievementsList}>
                            {lockedAchievements.map(achievement => (
                                <AchievementCard key={achievement.id} achievement={achievement} />
                            ))}
                        </View>
                    </View>
                )}

                {/* Empty state */}
                {achievements.length === 0 && !isLoading && (
                    <View style={styles.emptyState}>
                        <Icon name="emoji-events" size={64} color={colors.surface.border} />
                        <Text style={styles.emptyTitle}>No achievements yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Complete habits to unlock badges
                        </Text>
                    </View>
                )}

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
        paddingBottom: 16,
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
    progressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        marginTop: 8,
        padding: 20,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 193, 7, 0.2)',
        gap: 20,
    },
    progressLeft: {},
    progressIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 193, 7, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressRight: {
        flex: 1,
    },
    progressLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text.muted,
        letterSpacing: 1,
    },
    progressValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    progressTotal: {
        fontSize: 20,
        color: colors.text.muted,
        fontWeight: '600',
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.surface.dark,
        borderRadius: 4,
        marginTop: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.accent.gold,
        borderRadius: 4,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    achievementsList: {
        gap: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
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
    bottomSpacer: {
        height: 40,
    },
});

export default AchievementsScreen;
