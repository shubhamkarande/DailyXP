# DailyXP – Gamified Habit Tracker

DailyXP turns daily habits into a fun RPG experience. Users earn XP for completing tasks, build streaks, and level up in life.

## 🎮 Features

- **Gamified Experience**: Earn XP, level up, and build streaks
- **Beautiful UI**: Colorful, gamified interface with smooth animations
- **Real-time Sync**: Firebase integration for cross-device synchronization
- **Smart Notifications**: Habit reminders with Firebase Cloud Messaging
- **Progress Tracking**: Detailed stats and visualizations
- **Onboarding**: Guided setup with 3 starter habits

## 🏗️ Architecture

### Frontend (React Native + TypeScript)
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation 6
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Charts**: Victory Native
- **Animations**: React Native Reanimated
- **Authentication**: Firebase Auth
- **Database**: Firestore

### Backend (Express.js on Google Cloud Functions)
- **API Endpoints**: RESTful API for habit operations
- **Scheduled Functions**: Daily habit resets and streak checks
- **Push Notifications**: FCM for habit reminders
- **XP Calculation**: Server-side logic for XP and level calculations

## 📱 Screens & Components

### Screens
- **AuthScreen**: Sign up/Sign in with Firebase
- **OnboardingScreen**: Choose 3 starter habits
- **HomeScreen**: Today's habits with XP meter
- **StatsScreen**: Progress visualization and charts
- **HabitsScreen**: Manage all habits
- **HabitEditorScreen**: Add/edit/delete habits

### Components
- **XPMeter**: Animated progress bar showing level progress
- **HabitCard**: Interactive habit card with completion animation
- **RewardModal**: Celebration modal for XP gains and level-ups

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- React Native development environment
- Firebase project
- Google Cloud Platform account (for functions)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd dailyxp
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Cloud Messaging (optional, for notifications)
5. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
6. Place config files in appropriate directories:
   - Android: `android/app/google-services.json`
   - iOS: `ios/GoogleService-Info.plist`

### 3. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 4. Deploy Backend Functions

```bash
cd functions
npm install
npm run deploy
```

### 5. Configure Environment

Create `.env` file in root directory:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 6. Platform-specific Setup

#### Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### iOS
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

## 🎯 Usage

### Creating Habits
1. Tap the "+" button on the Habits screen
2. Enter habit title and select category
3. Choose XP reward value (10-50 XP)
4. Save to add to your daily routine

### Completing Habits
1. Tap the completion button on any habit card
2. Watch the satisfying animation and XP gain
3. Build streaks by completing habits daily
4. Level up as you accumulate XP!

### Tracking Progress
- View daily completion status on Home screen
- Check detailed stats and charts on Stats screen
- Monitor streaks and XP history
- Celebrate level-ups with reward modals

## 🔧 API Endpoints

### Backend Functions
- `POST /add-habit` - Add new habit
- `POST /complete-habit` - Mark habit as completed
- `GET /user-stats/:userId` - Get user statistics

### Scheduled Functions
- Daily habit reset (midnight UTC)
- Streak validation (1 AM UTC)
- Habit reminders (9 AM UTC)

## 🎨 UI/UX Design

### Theme
- **Colors**: Vibrant greens (#10B981, #059669) for primary actions
- **Typography**: Clean, readable fonts with proper hierarchy
- **Icons**: Category emojis for visual recognition
- **Animations**: Smooth transitions and micro-interactions

### Gamification Elements
- **XP System**: 10-50 XP per habit completion
- **Levels**: Every 100 XP = 1 level
- **Streaks**: Daily completion tracking
- **Rewards**: Celebration animations and modals
- **Progress Bars**: Visual feedback for advancement

## 📊 Data Structure

### User Document
```typescript
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
```

### Habit Document
```typescript
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
```

## 🔐 Security

- Firestore security rules restrict access to user's own data
- Firebase Auth handles user authentication
- Server-side validation for all habit operations
- Input sanitization and validation

## 🚀 Deployment

### Frontend (React Native)
- Build and deploy to App Store / Google Play Store
- Configure app signing and release builds

### Backend (Google Cloud Functions)
```bash
firebase deploy --only functions
```

### Database (Firestore)
```bash
firebase deploy --only firestore:rules
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Firebase for backend infrastructure
- React Native community for excellent libraries
- Victory Charts for beautiful data visualization
- NativeWind for Tailwind CSS integration

---

**Start your habit-building journey today with DailyXP!** 🎮✨