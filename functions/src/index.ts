import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

interface Habit {
  id: string;
  title: string;
  category: string;
  emoji: string;
  xpValue: number;
  streak: number;
  lastCompleted?: Date;
  createdAt: Date;
  isCompleted: boolean;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  habits: Habit[];
  createdAt: Date;
}

// Calculate level from total XP
const calculateLevel = (totalXP: number) => {
  const level = Math.floor(totalXP / 100) + 1;
  const currentLevelXP = totalXP % 100;
  const nextLevelXP = 100;
  return { level, currentLevelXP, nextLevelXP };
};

// Reset daily habits (called by cron job)
const resetDailyHabits = async () => {
  const usersSnapshot = await admin.firestore().collection('users').get();
  const batch = admin.firestore().batch();

  usersSnapshot.docs.forEach(doc => {
    const userData = doc.data() as User;
    const updatedHabits = userData.habits.map(habit => ({
      ...habit,
      isCompleted: false,
    }));

    batch.update(doc.ref, { habits: updatedHabits });
  });

  await batch.commit();
};

// Check and reset streaks for missed days
const checkStreaks = async () => {
  const usersSnapshot = await admin.firestore().collection('users').get();
  const batch = admin.firestore().batch();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  usersSnapshot.docs.forEach(doc => {
    const userData = doc.data() as User;
    const updatedHabits = userData.habits.map(habit => {
      if (habit.lastCompleted) {
        const lastCompleted = new Date(habit.lastCompleted);
        const daysDiff = Math.floor((yesterday.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) {
          // Reset streak if more than 1 day missed
          return { ...habit, streak: 0 };
        }
      }
      return habit;
    });

    batch.update(doc.ref, { habits: updatedHabits });
  });

  await batch.commit();
};

// Add habit endpoint
app.post('/add-habit', async (req, res) => {
  try {
    const { userId, habit } = req.body;

    if (!userId || !habit) {
      return res.status(400).json({ error: 'Missing userId or habit data' });
    }

    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data() as User;
    const updatedHabits = [...userData.habits, habit];

    await userRef.update({ habits: updatedHabits });

    res.json({ success: true, habit });
  } catch (error) {
    console.error('Error adding habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete habit endpoint
app.post('/complete-habit', async (req, res) => {
  try {
    const { userId, habitId } = req.body;

    if (!userId || !habitId) {
      return res.status(400).json({ error: 'Missing userId or habitId' });
    }

    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data() as User;
    const habit = userData.habits.find(h => h.id === habitId);

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    if (habit.isCompleted) {
      return res.status(400).json({ error: 'Habit already completed today' });
    }

    // Update habit
    const updatedHabits = userData.habits.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          isCompleted: true,
          lastCompleted: new Date(),
          streak: h.streak + 1,
        };
      }
      return h;
    });

    // Calculate new XP and level
    const newTotalXP = userData.totalXP + habit.xpValue;
    const { level, currentLevelXP, nextLevelXP } = calculateLevel(newTotalXP);
    const levelUp = level > userData.level;

    await userRef.update({
      habits: updatedHabits,
      totalXP: newTotalXP,
      level,
      currentLevelXP,
      nextLevelXP,
    });

    res.json({
      success: true,
      xpGained: habit.xpValue,
      newTotalXP,
      level,
      levelUp,
      streak: habit.streak + 1,
    });
  } catch (error) {
    console.error('Error completing habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user stats endpoint
app.get('/user-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await admin.firestore().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data() as User;
    const habits = userData.habits;

    // Calculate stats
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => {
      if (!h.lastCompleted) return false;
      const today = new Date().toDateString();
      const lastCompleted = new Date(h.lastCompleted).toDateString();
      return lastCompleted === today && h.isCompleted;
    }).length;

    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const avgStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);

    // Mock XP history for last 7 days
    const xpHistory = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      xp: Math.max(0, userData.totalXP - (6 - i) * 20 + Math.random() * 40),
    }));

    res.json({
      user: {
        id: userData.id,
        displayName: userData.displayName,
        totalXP: userData.totalXP,
        level: userData.level,
        currentLevelXP: userData.currentLevelXP,
        nextLevelXP: userData.nextLevelXP,
      },
      stats: {
        totalHabits,
        completedToday,
        avgStreak,
        longestStreak,
        completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
      },
      xpHistory,
      habits: habits.map(h => ({
        id: h.id,
        title: h.title,
        category: h.category,
        emoji: h.emoji,
        streak: h.streak,
        xpValue: h.xpValue,
        isCompleted: h.isCompleted,
      })),
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scheduled function to reset daily habits (runs at midnight UTC)
export const resetDailyHabitsScheduled = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('UTC')
  .onRun(async () => {
    await resetDailyHabits();
    console.log('Daily habits reset completed');
  });

// Scheduled function to check streaks (runs at 1 AM UTC)
export const checkStreaksScheduled = functions.pubsub
  .schedule('0 1 * * *')
  .timeZone('UTC')
  .onRun(async () => {
    await checkStreaks();
    console.log('Streak check completed');
  });

// HTTP function for habit operations
export const habitApi = functions.https.onRequest(app);

// Send habit reminders (optional with FCM)
export const sendHabitReminders = functions.pubsub
  .schedule('0 9 * * *') // 9 AM UTC
  .timeZone('UTC')
  .onRun(async () => {
    const usersSnapshot = await admin.firestore().collection('users').get();
    
    const promises = usersSnapshot.docs.map(async (doc) => {
      const userData = doc.data() as User;
      const incompleteHabits = userData.habits.filter(h => !h.isCompleted);
      
      if (incompleteHabits.length > 0) {
        // Send FCM notification (implement based on your FCM setup)
        const message = {
          notification: {
            title: 'DailyXP Reminder',
            body: `You have ${incompleteHabits.length} habits to complete today!`,
          },
          topic: `user_${userData.id}`,
        };
        
        try {
          await admin.messaging().send(message);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    });
    
    await Promise.all(promises);
    console.log('Habit reminders sent');
  });