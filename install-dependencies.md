# DailyXP - Installation Guide

## Step 1: Install Dependencies

Run this command to install all the required dependencies:

```bash
npm install
```

If you encounter any issues, try:

```bash
npm install --legacy-peer-deps
```

## Step 2: Platform-specific Setup

### For Android:
```bash
npx react-native run-android
```

### For iOS (if on macOS):
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## Step 3: If you get dependency errors

Some packages might need additional setup. Here are the core dependencies needed:

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler
npm install @reduxjs/toolkit react-redux
npm install react-native-chart-kit
npm install react-native-svg
npm install react-native-reanimated
```

## Step 4: Metro Configuration

Make sure your `metro.config.js` includes SVG transformer:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## Step 5: Run the App

After installing dependencies:

```bash
npm start
```

Then in another terminal:

```bash
npm run android
# or
npm run ios
```

## Troubleshooting

If you encounter module resolution errors:
1. Clear Metro cache: `npx react-native start --reset-cache`
2. Clean build: `cd android && ./gradlew clean && cd ..`
3. Reinstall node_modules: `rm -rf node_modules && npm install`

## Features Available

Once all dependencies are installed, you'll have access to:

- ✅ Enhanced habit tracking with streaks
- ✅ Achievement system
- ✅ Habit templates
- ✅ Advanced analytics
- ✅ Social features
- ✅ Smart notifications
- ✅ Profile customization
- ✅ Challenge system

## Current Status

The app is currently running in basic mode. After installing dependencies, uncomment the full app features in `App.tsx`.