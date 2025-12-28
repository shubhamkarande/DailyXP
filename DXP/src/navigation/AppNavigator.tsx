import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import CreateHabitScreen from '../screens/habits/CreateHabitScreen';
import { RootState, AppDispatch, loadStoredAuth } from '../store';
import { colors } from '../theme';

export type RootStackParamList = {
    Onboarding: undefined;
    Auth: undefined;
    Main: undefined;
    CreateHabit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, isAuthenticated, onboardingComplete } = useSelector(
        (state: RootState) => state.auth,
    );

    useEffect(() => {
        dispatch(loadStoredAuth());
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background.dark },
                }}>
                {!onboardingComplete && (
                    <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
                )}
                {!isAuthenticated && onboardingComplete && (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
                {isAuthenticated && (
                    <>
                        <Stack.Screen name="Main" component={MainNavigator} />
                        <Stack.Screen
                            name="CreateHabit"
                            component={CreateHabitScreen}
                            options={{
                                presentation: 'modal',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.dark,
    },
});

export default AppNavigator;

