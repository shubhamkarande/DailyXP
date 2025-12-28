import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { RootState, AppDispatch, logout } from '../../store';
import NotificationSettingsModal from '../../components/NotificationSettingsModal';

const ProfileScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { habits } = useSelector((state: RootState) => state.habits);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => dispatch(logout()),
                },
            ],
        );
    };

    const xpForNextLevel = user ? Math.floor(100 * user.level * 1.2) : 100;
    const xpProgress = user ? ((user.xp / xpForNextLevel) * 100).toFixed(0) : 0;
    const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);
    const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Icon name="person" size={48} color={colors.primary.DEFAULT} />
                        </View>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelBadgeText}>LVL {user?.level || 1}</Text>
                        </View>
                    </View>
                    <Text style={styles.username}>{user?.username || 'Hero'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>
                    {user?.isGuest && (
                        <View style={styles.guestBadge}>
                            <Icon name="person-outline" size={14} color={colors.text.muted} />
                            <Text style={styles.guestText}>Guest Account</Text>
                        </View>
                    )}
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user?.totalXpEarned || 0}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{longestStreak}</Text>
                        <Text style={styles.statLabel}>Best Streak</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalCompletions}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                </View>

                {/* XP Progress */}
                <View style={styles.xpCard}>
                    <View style={styles.xpHeader}>
                        <Text style={styles.xpTitle}>Level Progress</Text>
                        <Text style={styles.xpPercent}>{xpProgress}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${xpProgress}%` }]} />
                    </View>
                    <Text style={styles.xpSubtext}>
                        {user?.xp || 0} / {xpForNextLevel} XP to Level {(user?.level || 1) + 1}
                    </Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => setShowNotificationSettings(true)}>
                        <View style={styles.menuIcon}>
                            <Icon name="notifications" size={22} color={colors.primary.DEFAULT} />
                        </View>
                        <Text style={styles.menuText}>Notifications</Text>
                        <Icon name="chevron-right" size={24} color={colors.text.muted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Icon name="dark-mode" size={22} color={colors.primary.DEFAULT} />
                        </View>
                        <Text style={styles.menuText}>Appearance</Text>
                        <View style={styles.themeBadge}>
                            <Text style={styles.themeBadgeText}>Dark</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Icon name="info" size={22} color={colors.primary.DEFAULT} />
                        </View>
                        <Text style={styles.menuText}>About</Text>
                        <Icon name="chevron-right" size={24} color={colors.text.muted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Icon name="help" size={22} color={colors.primary.DEFAULT} />
                        </View>
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Icon name="chevron-right" size={24} color={colors.text.muted} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" size={20} color={colors.accent.red} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.version}>DailyXP v1.0.0</Text>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Notification Settings Modal */}
            <NotificationSettingsModal
                visible={showNotificationSettings}
                onClose={() => setShowNotificationSettings(false)}
            />
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
    profileHeader: {
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(127, 19, 236, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.primary.DEFAULT,
    },
    levelBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: colors.accent.gold,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: colors.background.dark,
    },
    levelBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: colors.surface.dark,
    },
    username: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    email: {
        fontSize: 14,
        color: colors.text.muted,
        marginTop: 4,
    },
    guestBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        backgroundColor: colors.card.dark,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    guestText: {
        fontSize: 12,
        color: colors.text.muted,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        marginHorizontal: 24,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.surface.border,
    },
    xpCard: {
        marginHorizontal: 24,
        marginTop: 24,
        padding: 20,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
    },
    xpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    xpTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    xpPercent: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
    },
    progressBar: {
        height: 12,
        backgroundColor: colors.surface.dark,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary.DEFAULT,
        borderRadius: 6,
    },
    xpSubtext: {
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 8,
        textAlign: 'center',
    },
    menuSection: {
        marginTop: 24,
        marginHorizontal: 24,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(127, 19, 236, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    themeBadge: {
        backgroundColor: colors.surface.dark,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    themeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 32,
        marginHorizontal: 24,
        padding: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.accent.red,
    },
    version: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 12,
        color: colors.text.muted,
    },
    bottomSpacer: {
        height: 40,
    },
});

export default ProfileScreen;
