import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { setOnboardingComplete, AppDispatch } from '../../store';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'XPJourney'>;
type RouteType = RouteProp<OnboardingStackParamList, 'XPJourney'>;

const XPJourneyScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteType>();
    const dispatch = useDispatch<AppDispatch>();
    const { focusAreas } = route.params;

    const handleBeginJourney = () => {
        dispatch(setOnboardingComplete());
        // Navigation to Auth will happen automatically via AppNavigator
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Background glows */}
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Hero Illustration */}
                <View style={styles.heroContainer}>
                    <View style={styles.heroGlow} />

                    {/* Trophy icon */}
                    <View style={styles.trophyContainer}>
                        <Icon name="emoji-events" size={80} color={colors.accent.gold} />
                    </View>

                    {/* Floating badges */}
                    <View style={styles.badge1}>
                        <Icon name="bolt" size={20} color={colors.accent.gold} />
                    </View>
                    <View style={styles.badge2}>
                        <Icon name="star" size={18} color={colors.primary.light} />
                    </View>
                    <View style={styles.badge3}>
                        <Icon name="local-fire-department" size={22} color={colors.accent.orange} />
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Your XP Journey{'\n'}
                        <Text style={styles.titleAccent}>Awaits!</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Complete daily quests to earn XP, unlock levels, and build unstoppable habits.
                    </Text>
                </View>

                {/* Stats Preview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>🔥</Text>
                        <Text style={styles.statLabel}>Streaks</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>⚡</Text>
                        <Text style={styles.statLabel}>XP Points</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>🏆</Text>
                        <Text style={styles.statLabel}>Levels</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Page indicators */}
                <View style={styles.indicators}>
                    <View style={styles.indicator} />
                    <View style={styles.indicator} />
                    <View style={[styles.indicator, styles.indicatorActive]} />
                </View>

                {/* Begin Journey Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleBeginJourney}
                    activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Begin Your Journey</Text>
                    <Icon name="play-arrow" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },
    glowTop: {
        position: 'absolute',
        top: 50,
        left: '50%',
        marginLeft: -width * 0.4,
        width: width * 0.8,
        height: width * 0.6,
        backgroundColor: colors.primary.DEFAULT,
        opacity: 0.15,
        borderRadius: 200,
    },
    glowBottom: {
        position: 'absolute',
        bottom: 100,
        right: -50,
        width: width * 0.5,
        height: width * 0.4,
        backgroundColor: colors.accent.gold,
        opacity: 0.08,
        borderRadius: 200,
    },
    header: {
        height: 80,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    heroContainer: {
        width: width * 0.55,
        height: width * 0.55,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    heroGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.accent.gold,
        opacity: 0.15,
        borderRadius: 200,
        transform: [{ scale: 1.2 }],
    },
    trophyContainer: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: width * 0.2,
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 193, 7, 0.2)',
    },
    badge1: {
        position: 'absolute',
        top: 10,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.card.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.surface.border,
    },
    badge2: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.card.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.surface.border,
    },
    badge3: {
        position: 'absolute',
        bottom: 50,
        right: 0,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.card.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.surface.border,
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        maxWidth: 320,
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 38,
    },
    titleAccent: {
        color: colors.accent.gold,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card.dark,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        gap: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 28,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.surface.border,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    indicatorActive: {
        width: 32,
        backgroundColor: colors.primary.DEFAULT,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primary.DEFAULT,
        height: 56,
        borderRadius: 28,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});

export default XPJourneyScreen;
