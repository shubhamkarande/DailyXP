import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUser, setLoading } from '../store/slices/authSlice';
import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { HabitEditorScreen } from '../screens/HabitEditorScreen';
import { SocialScreen } from '../screens/SocialScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { HabitTemplatesScreen } from '../screens/HabitTemplatesScreen';
import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>🏠</span>
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>📊</span>
          ),
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarLabel: 'Habits',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>⚡</span>
          ),
        }}
      />
      <Tab.Screen
        name="Social"
        component={SocialScreen}
        options={{
          tabBarLabel: 'Social',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>👥</span>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>👤</span>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();

  // For demo purposes, we'll skip authentication and go straight to the main app
  useEffect(() => {
    // Set a mock user for demo
    dispatch(
      setUser({
        id: 'demo-user',
        email: 'demo@dailyxp.com',
        displayName: 'Demo User',
        totalXP: 1250,
        level: 13,
        currentLevelXP: 50,
        nextLevelXP: 100,
        habits: [],
        createdAt: new Date(),
        achievements: [],
        friends: [],
        theme: 'light',
        avatar: '🎮',
        preferences: {
          notifications: true,
          reminderTime: '09:00',
          weekStartsOn: 'monday',
          theme: 'light',
          soundEnabled: true,
          vibrationEnabled: true,
        },
      }),
    );
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="HabitEditor"
          component={HabitEditorScreen}
          options={{
            headerShown: true,
            title: 'Edit Habit',
            headerStyle: { backgroundColor: '#10B981' },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="Achievements"
          component={AchievementsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HabitTemplates"
          component={HabitTemplatesScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
