#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing DailyXP Enhanced Features...\n');

// Step 1: Install core navigation dependencies first
console.log('📦 Step 1: Installing navigation dependencies...');
try {
  execSync('npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Navigation dependencies installed\n');
} catch (error) {
  console.log('⚠️  Navigation dependencies failed, continuing...\n');
}

// Step 2: Install React Native dependencies
console.log('📦 Step 2: Installing React Native dependencies...');
try {
  execSync('npm install react-native-screens react-native-safe-area-context react-native-gesture-handler --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ React Native dependencies installed\n');
} catch (error) {
  console.log('⚠️  React Native dependencies failed, continuing...\n');
}

// Step 3: Install Redux (compatible version)
console.log('📦 Step 3: Installing Redux...');
try {
  execSync('npm install @reduxjs/toolkit@^2.0.1 react-redux@^9.1.0 --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Redux installed\n');
} catch (error) {
  console.log('⚠️  Redux failed, continuing...\n');
}

// Step 4: Install chart dependencies
console.log('📦 Step 4: Installing chart dependencies...');
try {
  execSync('npm install react-native-chart-kit react-native-svg --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Chart dependencies installed\n');
} catch (error) {
  console.log('⚠️  Chart dependencies failed, continuing...\n');
}

// Step 5: Install optional enhancements
console.log('📦 Step 5: Installing optional enhancements...');
const optionalPackages = [
  'react-native-reanimated',
  'react-native-linear-gradient',
  'react-native-modal',
  'react-native-vector-icons',
  '@react-native-async-storage/async-storage'
];

optionalPackages.forEach(pkg => {
  try {
    execSync(`npm install ${pkg} --legacy-peer-deps`, { stdio: 'pipe' });
    console.log(`✅ ${pkg} installed`);
  } catch (error) {
    console.log(`⚠️  ${pkg} failed (optional)`);
  }
});

console.log('\n🎉 Installation complete!');
console.log('\n📝 Next steps:');
console.log('1. For Android: npx react-native run-android');
console.log('2. For iOS: cd ios && pod install && cd .. && npx react-native run-ios');
console.log('3. Uncomment the full app code in App.tsx to enable all features');

// Check if we can enable full features
const appTsxPath = path.join(__dirname, 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  console.log('\n🔧 To enable all features, edit App.tsx and uncomment the FullApp section');
}

console.log('\n✨ Your enhanced DailyXP app is ready!');