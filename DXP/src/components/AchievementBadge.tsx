import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    xpReward: number;
    unlocked: boolean;
    unlockedAt?: string;
}

interface AchievementBadgeProps {
    achievement: Achievement;
    size?: 'small' | 'medium' | 'large';
    onPress?: () => void;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
    achievement,
    size = 'medium',
    onPress,
}) => {
    const sizes = {
        small: { badge: 48, icon: 20, border: 2 },
        medium: { badge: 64, icon: 28, border: 3 },
        large: { badge: 80, icon: 36, border: 4 },
    };

    const s = sizes[size];

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    width: s.badge,
                    height: s.badge,
                    borderRadius: s.badge / 2,
                    borderWidth: s.border,
                    borderColor: achievement.unlocked ? achievement.color : colors.surface.border,
                    backgroundColor: achievement.unlocked
                        ? `${achievement.color}15`
                        : colors.surface.dark,
                },
            ]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}>
            <Icon
                name={achievement.icon}
                size={s.icon}
                color={achievement.unlocked ? achievement.color : colors.text.muted}
                style={!achievement.unlocked && styles.locked}
            />
            {!achievement.unlocked && (
                <View style={styles.lockOverlay}>
                    <Icon name="lock" size={s.icon * 0.5} color={colors.text.muted} />
                </View>
            )}
        </TouchableOpacity>
    );
};

interface AchievementCardProps {
    achievement: Achievement;
    onPress?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
    achievement,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.card,
                achievement.unlocked && {
                    borderColor: achievement.color,
                    backgroundColor: `${achievement.color}10`,
                },
            ]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}>
            <View
                style={[
                    styles.cardIcon,
                    {
                        backgroundColor: achievement.unlocked
                            ? `${achievement.color}20`
                            : colors.surface.dark,
                        borderColor: achievement.unlocked ? achievement.color : colors.surface.border,
                    },
                ]}>
                <Icon
                    name={achievement.icon}
                    size={28}
                    color={achievement.unlocked ? achievement.color : colors.text.muted}
                />
                {!achievement.unlocked && (
                    <View style={styles.cardLockOverlay}>
                        <Icon name="lock" size={14} color={colors.text.muted} />
                    </View>
                )}
            </View>
            <View style={styles.cardContent}>
                <Text
                    style={[
                        styles.cardTitle,
                        !achievement.unlocked && styles.cardTitleLocked,
                    ]}>
                    {achievement.title}
                </Text>
                <Text style={styles.cardDescription}>{achievement.description}</Text>
                {achievement.xpReward > 0 && (
                    <View style={styles.xpBadge}>
                        <Icon name="bolt" size={12} color={colors.accent.gold} />
                        <Text style={styles.xpText}>+{achievement.xpReward} XP</Text>
                    </View>
                )}
            </View>
            {achievement.unlocked && (
                <Icon name="check-circle" size={24} color={achievement.color} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    locked: {
        opacity: 0.4,
    },
    lockOverlay: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: colors.card.dark,
        borderRadius: 10,
        padding: 2,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.card.dark,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.surface.border,
        gap: 16,
    },
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    cardLockOverlay: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: colors.card.dark,
        borderRadius: 8,
        padding: 2,
    },
    cardContent: {
        flex: 1,
        gap: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    cardTitleLocked: {
        color: colors.text.muted,
    },
    cardDescription: {
        fontSize: 13,
        color: colors.text.muted,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    xpText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.accent.gold,
    },
});

export default AchievementBadge;
