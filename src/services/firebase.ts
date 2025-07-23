import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Habit, User } from '../types';

export class FirebaseService {
  // Auth methods
  static async signUp(email: string, password: string, displayName: string) {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName });
    
    // Create user profile in Firestore
    const userProfile: User = {
      id: userCredential.user.uid,
      email,
      displayName,
      totalXP: 0,
      level: 1,
      currentLevelXP: 0,
      nextLevelXP: 100,
      habits: [],
      createdAt: new Date(),
    };
    
    await firestore().collection('users').doc(userCredential.user.uid).set(userProfile);
    return userCredential.user;
  }

  static async signIn(email: string, password: string) {
    return await auth().signInWithEmailAndPassword(email, password);
  }

  static async signOut() {
    return await auth().signOut();
  }

  // User methods
  static async getUserProfile(userId: string): Promise<User | null> {
    const doc = await firestore().collection('users').doc(userId).get();
    return doc.exists ? (doc.data() as User) : null;
  }

  static async updateUserProfile(userId: string, updates: Partial<User>) {
    return await firestore().collection('users').doc(userId).update(updates);
  }

  // Habit methods
  static async addHabit(userId: string, habit: Habit) {
    const userRef = firestore().collection('users').doc(userId);
    return await userRef.update({
      habits: firestore.FieldValue.arrayUnion(habit),
    });
  }

  static async updateHabit(userId: string, habit: Habit) {
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as User;
      const updatedHabits = userData.habits.map(h => h.id === habit.id ? habit : h);
      await userDoc.ref.update({ habits: updatedHabits });
    }
  }

  static async deleteHabit(userId: string, habitId: string) {
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as User;
      const updatedHabits = userData.habits.filter(h => h.id !== habitId);
      await userDoc.ref.update({ habits: updatedHabits });
    }
  }

  static async completeHabit(userId: string, habitId: string, xpGained: number) {
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as User;
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
      
      const newTotalXP = userData.totalXP + xpGained;
      const level = Math.floor(newTotalXP / 100) + 1;
      const currentLevelXP = newTotalXP % 100;
      
      await userDoc.ref.update({
        habits: updatedHabits,
        totalXP: newTotalXP,
        level,
        currentLevelXP,
      });
    }
  }

  // Real-time listeners
  static subscribeToUserProfile(userId: string, callback: (user: User | null) => void) {
    return firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(doc => {
        callback(doc.exists ? (doc.data() as User) : null);
      });
  }
}