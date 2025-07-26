import PushNotification from 'react-native-push-notification';
import { Habit, User } from '../types';

export class NotificationService {
  static initialize() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'habit-reminders',
        channelName: 'Habit Reminders',
        channelDescription: 'Notifications for habit reminders',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }

  static scheduleHabitReminder(habit: Habit, reminderTime: string) {
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      id: habit.id,
      channelId: 'habit-reminders',
      title: `Time for ${habit.title}! ${habit.emoji}`,
      message: `Don't break your ${habit.streak}-day streak! Complete this habit to earn ${habit.xpValue} XP.`,
      date: scheduledTime,
      repeatType: 'day',
      actions: ['Complete', 'Snooze'],
      userInfo: {
        habitId: habit.id,
        type: 'habit-reminder',
      },
    });
  }

  static cancelHabitReminder(habitId: string) {
    PushNotification.cancelLocalNotifications({ id: habitId });
  }

  static scheduleStreakCelebration(habit: Habit) {
    const celebrationMessages = {
      3: `🔥 3-day streak! You're on fire with ${habit.title}!`,
      7: `⚡ One week strong! ${habit.title} is becoming a habit!`,
      14: `🌟 Two weeks! You're crushing ${habit.title}!`,
      30: `👑 30 days! You're a ${habit.title} champion!`,
      100: `💎 100 days! You're a legend at ${habit.title}!`,
    };

    const message = celebrationMessages[habit.streak as keyof typeof celebrationMessages];
    
    if (message) {
      PushNotification.localNotification({
        channelId: 'habit-reminders',
        title: 'Streak Milestone! 🎉',
        message,
        userInfo: {
          habitId: habit.id,
          type: 'streak-celebration',
        },
      });
    }
  }

  static scheduleLevelUpNotification(user: User, newLevel: number) {
    const levelMessages = {
      5: 'Rising Star! ⭐',
      10: 'Habit Hero! 🦸',
      15: 'Consistency King/Queen! 👑',
      20: 'Legendary! 🏆',
      25: 'Habit Master! 🥇',
    };

    const title = levelMessages[newLevel as keyof typeof levelMessages] || 'Level Up!';

    PushNotification.localNotification({
      channelId: 'habit-reminders',
      title: `${title} Level ${newLevel}!`,
      message: `Congratulations! You've reached level ${newLevel}. Keep building those habits!`,
      userInfo: {
        userId: user.id,
        type: 'level-up',
        newLevel,
      },
    });
  }

  static scheduleMotivationalReminder() {
    const motivationalMessages = [
      'Small steps lead to big changes! 🚀',
      'Your future self will thank you! 💪',
      'Consistency beats perfection! ⭐',
      'Every habit completed is a victory! 🏆',
      'You\'re building the life you want! 🌟',
      'Progress, not perfection! 📈',
      'Your habits shape your destiny! ✨',
      'One day at a time, one habit at a time! 🎯',
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    // Schedule for evening (7 PM)
    const scheduledTime = new Date();
    scheduledTime.setHours(19, 0, 0, 0);

    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      channelId: 'habit-reminders',
      title: 'Daily Motivation 💫',
      message: randomMessage,
      date: scheduledTime,
      repeatType: 'day',
      userInfo: {
        type: 'motivation',
      },
    });
  }

  static scheduleWeeklyReview() {
    // Schedule for Sunday evening (6 PM)
    const scheduledTime = new Date();
    const dayOfWeek = scheduledTime.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    
    scheduledTime.setDate(scheduledTime.getDate() + daysUntilSunday);
    scheduledTime.setHours(18, 0, 0, 0);

    PushNotification.localNotificationSchedule({
      channelId: 'habit-reminders',
      title: 'Weekly Review 📊',
      message: 'How did your habits go this week? Check your progress and plan for next week!',
      date: scheduledTime,
      repeatType: 'week',
      userInfo: {
        type: 'weekly-review',
      },
    });
  }

  static scheduleInactivityReminder() {
    // Schedule for tomorrow if user hasn't completed any habits today
    const scheduledTime = new Date();
    scheduledTime.setDate(scheduledTime.getDate() + 1);
    scheduledTime.setHours(10, 0, 0, 0);

    PushNotification.localNotificationSchedule({
      id: 'inactivity-reminder',
      channelId: 'habit-reminders',
      title: 'Missing you! 😊',
      message: 'Your habits are waiting for you. Come back and keep your streaks alive!',
      date: scheduledTime,
      userInfo: {
        type: 'inactivity',
      },
    });
  }

  static cancelInactivityReminder() {
    PushNotification.cancelLocalNotifications({ id: 'inactivity-reminder' });
  }

  static scheduleAchievementUnlock(achievement: any) {
    PushNotification.localNotification({
      channelId: 'habit-reminders',
      title: `Achievement Unlocked! ${achievement.icon}`,
      message: `${achievement.title}: ${achievement.description}. You earned ${achievement.xpReward} XP!`,
      userInfo: {
        achievementId: achievement.id,
        type: 'achievement-unlock',
      },
    });
  }

  static scheduleSmartReminders(habits: Habit[], user: User) {
    // Cancel existing reminders
    habits.forEach(habit => {
      this.cancelHabitReminder(habit.id);
    });

    // Schedule new reminders based on user preferences and habit patterns
    habits.forEach(habit => {
      if (habit.isActive && habit.reminderTime) {
        // Basic reminder
        this.scheduleHabitReminder(habit, habit.reminderTime);

        // Smart reminders based on streak risk
        if (habit.streak > 0) {
          const lastCompleted = habit.lastCompleted;
          if (lastCompleted) {
            const hoursSinceLastCompletion = (Date.now() - lastCompleted.getTime()) / (1000 * 60 * 60);
            
            // If it's been more than 20 hours since last completion, send urgent reminder
            if (hoursSinceLastCompletion > 20) {
              const urgentTime = new Date();
              urgentTime.setMinutes(urgentTime.getMinutes() + 30);

              PushNotification.localNotificationSchedule({
                id: `${habit.id}-urgent`,
                channelId: 'habit-reminders',
                title: `Don't lose your streak! 🚨`,
                message: `Your ${habit.streak}-day streak for ${habit.title} is at risk! Complete it now to keep going.`,
                date: urgentTime,
                userInfo: {
                  habitId: habit.id,
                  type: 'urgent-reminder',
                },
              });
            }
          }
        }
      }
    });

    // Schedule motivational and review notifications
    this.scheduleMotivationalReminder();
    this.scheduleWeeklyReview();
  }

  static handleNotificationAction(notification: any, action: string) {
    const { habitId, type } = notification.userInfo;

    switch (action) {
      case 'Complete':
        // Handle habit completion from notification
        console.log('Completing habit from notification:', habitId);
        break;
      case 'Snooze':
        // Snooze for 30 minutes
        const snoozeTime = new Date();
        snoozeTime.setMinutes(snoozeTime.getMinutes() + 30);
        
        PushNotification.localNotificationSchedule({
          id: `${habitId}-snooze`,
          channelId: 'habit-reminders',
          title: 'Snooze reminder 😴',
          message: 'Time to complete your habit!',
          date: snoozeTime,
          userInfo: {
            habitId,
            type: 'snooze-reminder',
          },
        });
        break;
    }
  }
}