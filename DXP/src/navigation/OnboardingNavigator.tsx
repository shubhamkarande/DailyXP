import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import FocusAreaScreen from '../screens/onboarding/FocusAreaScreen';
import XPJourneyScreen from '../screens/onboarding/XPJourneyScreen';

export type OnboardingStackParamList = {
    Welcome: undefined;
    FocusArea: undefined;
    XPJourney: { focusAreas: string[] };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#191022' },
            }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="FocusArea" component={FocusAreaScreen} />
            <Stack.Screen name="XPJourney" component={XPJourneyScreen} />
        </Stack.Navigator>
    );
};

export default OnboardingNavigator;

