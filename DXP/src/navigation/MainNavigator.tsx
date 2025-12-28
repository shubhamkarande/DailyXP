import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import HabitsScreen from '../screens/habits/HabitsScreen';
import AchievementsScreen from '../screens/achievements/AchievementsScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../theme';

export type MainTabParamList = {
    Dashboard: undefined;
    Habits: undefined;
    Achievements: undefined;
    Stats: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.primary.DEFAULT,
                tabBarInactiveTintColor: colors.text.muted,
                tabBarLabelStyle: styles.tabLabel,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = 'dashboard';

                    switch (route.name) {
                        case 'Dashboard':
                            iconName = 'dashboard';
                            break;
                        case 'Habits':
                            iconName = 'checklist';
                            break;
                        case 'Achievements':
                            iconName = 'emoji-events';
                            break;
                        case 'Stats':
                            iconName = 'bar-chart';
                            break;
                        case 'Profile':
                            iconName = 'person';
                            break;
                    }

                    return (
                        <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                            <Icon name={iconName} size={22} color={color} />
                        </View>
                    );
                },
            })}>
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="Habits"
                component={HabitsScreen}
                options={{ tabBarLabel: 'Quests' }}
            />
            <Tab.Screen
                name="Achievements"
                component={AchievementsScreen}
                options={{ tabBarLabel: 'Badges' }}
            />
            <Tab.Screen
                name="Stats"
                component={StatsScreen}
                options={{ tabBarLabel: 'Stats' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'rgba(26, 17, 34, 0.95)',
        borderTopWidth: 0,
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        borderRadius: 32,
        height: 70,
        paddingBottom: 8,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    tabLabel: {
        fontSize: 9,
        fontWeight: '600',
        marginTop: 2,
    },
    iconContainer: {
        padding: 6,
        borderRadius: 14,
    },
    iconContainerActive: {
        backgroundColor: 'rgba(127, 19, 236, 0.1)',
    },
});

export default MainNavigator;
