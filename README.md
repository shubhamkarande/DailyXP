# DailyXP 🎮

**Turn habits into levels. Consistency becomes power.**

A gamified habit-tracking mobile app that converts daily routines into an RPG-style progression system. Earn XP, maintain streaks, unlock levels, and visualize consistency over time.

![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

## ✨ Features

### Core Features

- 🎮 **XP & Leveling System** - Earn XP for completing habits
- 🔥 **Habit Streaks** - Track consecutive completions with multipliers
- 📊 **Progress Analytics** - Weekly charts and completion stats
- ⏰ **Daily/Weekly Habits** - Flexible frequency options
- 📱 **Offline-First** - Works without internet, syncs when online
- 🔐 **Secure Accounts** - JWT authentication with guest mode

### Gamification

- Difficulty-based XP rewards (Easy: 10, Medium: 25, Hard: 50 XP)
- Streak multipliers (up to 2x at 70+ day streaks)
- Level progression with exponential XP requirements
- "Perfect Day" bonuses for completing all habits

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio / Xcode
- MongoDB Atlas account (free tier)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm run dev
```

### Mobile App Setup

```bash
cd DailyXPMobile
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
cd ios && pod install && cd ..
npm run ios
```

## 🏗️ Project Structure

```
DailyXP/
├── backend/                 # Node.js Express API
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth middleware
│   ├── utils/               # XP & streak logic
│   └── index.js             # Server entry
│
├── DailyXPMobile/           # React Native App
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── screens/         # App screens
│   │   ├── store/           # Redux slices
│   │   ├── navigation/      # React Navigation
│   │   ├── services/        # API service
│   │   └── theme/           # Design tokens
│   └── App.tsx              # Entry point
│
└── stitch_select_focus_area/ # UI reference designs
```

## 📱 Screens

| Screen | Description |
|--------|-------------|
| Welcome | Onboarding with XP ring visual |
| Focus Area | Select Health/Learning/Productivity |
| XP Journey | Final onboarding with stats preview |
| Login/Register | Authentication with guest mode |
| Dashboard | Level HUD, today's quests, XP progress |
| Habits | Full quest list with filters |
| Create Habit | New quest with difficulty selection |
| Stats | Weekly XP chart, streak overview |
| Profile | User stats, settings, logout |

## 🔌 API Endpoints

### Authentication

- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /auth/guest` - Guest mode
- `GET /auth/me` - Current user

### Habits

- `GET /habits` - List habits
- `POST /habits` - Create habit
- `POST /habits/:id/complete` - Complete habit
- `DELETE /habits/:id` - Delete habit

### Progress

- `GET /progress/summary` - Daily summary
- `GET /progress/streaks` - Streak data
- `GET /progress/chart` - XP chart data

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#7f13ec` | Buttons, XP bars |
| Background | `#191022` | Dark theme |
| Surface | `#261933` | Cards, inputs |
| Accent Gold | `#FFC107` | Level badges |
| Accent Green | `#4ade80` | Success states |

Font: Plus Jakarta Sans

## 🧪 Environment Variables

```env
# Backend
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ using React Native, Redux Toolkit, Express, and MongoDB.
