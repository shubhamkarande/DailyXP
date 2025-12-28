import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

// Notification settings storage key
const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

interface NotificationSettings {
    enabled: boolean;
    dailyReminderTime: string; // HH:MM format
    reminderDays: number[]; // 0-6 (Sun-Sat)
    streakReminders: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
    enabled: true,
    dailyReminderTime: '09:00',
    reminderDays: [1, 2, 3, 4, 5, 6, 0], // All days
    streakReminders: true,
};

/**
 * Get notification settings
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
    try {
        const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error getting notification settings:', error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Save notification settings
 */
export async function saveNotificationSettings(
    settings: Partial<NotificationSettings>,
): Promise<void> {
    try {
        const current = await getNotificationSettings();
        const updated = { ...current, ...settings };
        await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error saving notification settings:', error);
    }
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
    try {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'DailyXP Notifications',
                        message:
                            'DailyXP needs notification permission to remind you about your daily quests and keep your streaks alive!',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'Allow',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
            return true; // Permissions not needed below Android 13
        }

        // iOS would use a different method (react-native-push-notification or similar)
        return true;
    } catch (error) {
        console.error('Notification permission error:', error);
        return false;
    }
}

/**
 * Schedule a daily reminder notification
 * Note: This is a placeholder - actual implementation would use
 * react-native-push-notification or @notifee/react-native
 */
export async function scheduleDailyReminder(time: string): Promise<void> {
    // In a real implementation, you would:
    // 1. Cancel any existing scheduled notifications
    // 2. Parse the time string
    // 3. Schedule a repeating notification

    console.log(`Daily reminder scheduled for ${time}`);

    const settings = await getNotificationSettings();
    await saveNotificationSettings({ ...settings, dailyReminderTime: time });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
    // In a real implementation, cancel all pending notifications
    console.log('All notifications cancelled');
}

/**
 * Show immediate notification (for testing or instant alerts)
 */
export function showNotification(title: string, body: string): void {
    // In a real implementation, show an immediate local notification
    // For now, we'll use an Alert as a fallback
    Alert.alert(title, body);
}

/**
 * Notification messages
 */
export const NOTIFICATION_MESSAGES = {
    dailyReminder: {
        title: '🎮 Time for Your Daily Quests!',
        body: "Your habits are waiting. Complete them to earn XP and level up!",
    },
    streakAtRisk: {
        title: '🔥 Streak at Risk!',
        body: "Don't break your streak! Complete your habits before midnight.",
    },
    levelUp: {
        title: '🎉 Level Up!',
        body: 'Congratulations! You reached a new level!',
    },
    perfectDay: {
        title: '⭐ Perfect Day!',
        body: 'Amazing! You completed all your habits today!',
    },
    achievementUnlocked: {
        title: '🏆 Achievement Unlocked!',
        body: 'You earned a new badge!',
    },
    weeklyStreak: {
        title: '🔥 7-Day Streak!',
        body: 'Incredible! You maintained a 7-day streak!',
    },
};

export default {
    getNotificationSettings,
    saveNotificationSettings,
    requestNotificationPermission,
    scheduleDailyReminder,
    cancelAllNotifications,
    showNotification,
    NOTIFICATION_MESSAGES,
};
