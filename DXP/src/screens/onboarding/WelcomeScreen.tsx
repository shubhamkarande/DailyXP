import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fontSize, fontWeight } from '../../theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Background glow effects */}
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            {/* Header spacer */}
            <View style={styles.header} />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Hero Visual */}
                <View style={styles.heroContainer}>
                    {/* Outer glow */}
                    <View style={styles.heroGlow} />

                    {/* Ring decorations */}
                    <View style={styles.ringOuter} />
                    <View style={styles.ringInner} />

                    {/* Main XP circle */}
                    <View style={styles.xpCircle}>
                        <View style={styles.xpContent}>
                            <Icon name="bolt" size={48} color={colors.accent.gold} />
                            <Text style={styles.xpText}>0 XP</Text>
                            <Text style={styles.levelLabel}>BEGINNER</Text>
                        </View>

                        {/* Progress ring visual */}
                        <View style={styles.progressRing} />
                    </View>

                    {/* Floating level badge */}
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>LVL 1</Text>
                    </View>

                    {/* Floating +10 XP */}
                    <View style={styles.xpFloating}>
                        <Text style={styles.xpFloatingText}>+10 XP</Text>
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Turn habits {'\n'}
                        <Text style={styles.titleGradient}>into levels.</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Consistency becomes power. Track your daily wins and watch your stats grow.
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Page indicators */}
                <View style={styles.indicators}>
                    <View style={[styles.indicator, styles.indicatorActive]} />
                    <View style={styles.indicator} />
                    <View style={styles.indicator} />
                </View>

                {/* Get Started Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('FocusArea')}
                    activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Get Started</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
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
        top: -50,
        left: -50,
        width: width * 0.6,
        height: width * 0.5,
        backgroundColor: colors.primary.DEFAULT,
        opacity: 0.15,
        borderRadius: 200,
        transform: [{ scale: 1.5 }],
    },
    glowBottom: {
        position: 'absolute',
        bottom: -50,
        right: -50,
        width: width * 0.5,
        height: width * 0.4,
        backgroundColor: colors.primary.DEFAULT,
        opacity: 0.1,
        borderRadius: 200,
        transform: [{ scale: 1.5 }],
    },
    header: {
        height: 80,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    heroContainer: {
        width: width * 0.72,
        height: width * 0.72,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    heroGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary.DEFAULT,
        opacity: 0.25,
        borderRadius: 200,
        transform: [{ scale: 1.2 }],
    },
    ringOuter: {
        position: 'absolute',
        width: '110%',
        height: '110%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 400,
    },
    ringInner: {
        position: 'absolute',
        width: '92%',
        height: '92%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 400,
    },
    xpCircle: {
        width: width * 0.64,
        height: width * 0.64,
        borderRadius: width * 0.32,
        backgroundColor: colors.surface.dark,
        borderWidth: 4,
        borderColor: colors.surface.dark,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    xpContent: {
        alignItems: 'center',
        zIndex: 2,
    },
    xpText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        marginTop: 4,
    },
    levelLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.6)',
        letterSpacing: 3,
        marginTop: 4,
    },
    progressRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderWidth: 6,
        borderColor: 'transparent',
        borderTopColor: colors.primary.DEFAULT,
        borderRadius: 200,
        transform: [{ rotate: '-90deg' }],
    },
    levelBadge: {
        position: 'absolute',
        top: -10,
        right: 10,
        backgroundColor: colors.accent.gold,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: colors.background.dark,
        transform: [{ rotate: '6deg' }],
    },
    levelBadgeText: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.surface.dark,
    },
    xpFloating: {
        position: 'absolute',
        bottom: 20,
        left: -10,
        backgroundColor: 'rgba(38, 25, 51, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(127, 19, 236, 0.3)',
        transform: [{ rotate: '-12deg' }],
    },
    xpFloatingText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary.light,
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        maxWidth: 320,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 40,
    },
    titleGradient: {
        color: colors.primary.light,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(148, 163, 184, 1)',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 26,
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
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
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

export default WelcomeScreen;
