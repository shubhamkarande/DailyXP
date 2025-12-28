import React, { useState } from 'react';
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
import { colors } from '../../theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'FocusArea'>;

const FOCUS_AREAS = [
    {
        id: 'health',
        title: 'Health',
        subtitle: 'Exercise, sleep, hydration',
        icon: 'favorite',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.15)',
    },
    {
        id: 'learning',
        title: 'Learning',
        subtitle: 'Reading, courses, skills',
        icon: 'school',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.15)',
    },
    {
        id: 'productivity',
        title: 'Productivity',
        subtitle: 'Focus, planning, work',
        icon: 'rocket-launch',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.15)',
    },
];

const FocusAreaScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    const toggleArea = (areaId: string) => {
        setSelectedAreas(prev =>
            prev.includes(areaId)
                ? prev.filter(id => id !== areaId)
                : [...prev, areaId],
        );
    };

    const handleContinue = () => {
        navigation.navigate('XPJourney', { focusAreas: selectedAreas });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Background glow */}
            <View style={styles.glowTop} />

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
                <View style={styles.titleContainer}>
                    <Text style={styles.label}>STEP 1 OF 2</Text>
                    <Text style={styles.title}>Select your{'\n'}focus areas</Text>
                    <Text style={styles.subtitle}>
                        Choose the areas you want to improve. We'll create starter quests for you.
                    </Text>
                </View>

                {/* Focus Area Cards */}
                <View style={styles.cardsContainer}>
                    {FOCUS_AREAS.map(area => (
                        <TouchableOpacity
                            key={area.id}
                            style={[
                                styles.card,
                                selectedAreas.includes(area.id) && styles.cardSelected,
                            ]}
                            onPress={() => toggleArea(area.id)}
                            activeOpacity={0.8}>
                            <View style={[styles.iconContainer, { backgroundColor: area.bgColor }]}>
                                <Icon name={area.icon} size={28} color={area.color} />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{area.title}</Text>
                                <Text style={styles.cardSubtitle}>{area.subtitle}</Text>
                            </View>
                            <View
                                style={[
                                    styles.checkbox,
                                    selectedAreas.includes(area.id) && styles.checkboxSelected,
                                ]}>
                                {selectedAreas.includes(area.id) && (
                                    <Icon name="check" size={18} color="#fff" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Page indicators */}
                <View style={styles.indicators}>
                    <View style={styles.indicator} />
                    <View style={[styles.indicator, styles.indicatorActive]} />
                    <View style={styles.indicator} />
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedAreas.length === 0 && styles.buttonDisabled,
                    ]}
                    onPress={handleContinue}
                    disabled={selectedAreas.length === 0}
                    activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Continue</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => navigation.navigate('XPJourney', { focusAreas: [] })}>
                    <Text style={styles.skipText}>Skip for now</Text>
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
        top: -100,
        right: -50,
        width: width * 0.7,
        height: width * 0.5,
        backgroundColor: colors.primary.DEFAULT,
        opacity: 0.12,
        borderRadius: 200,
        transform: [{ scale: 1.5 }],
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
        paddingHorizontal: 24,
    },
    titleContainer: {
        marginBottom: 32,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
        letterSpacing: 2,
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 38,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.muted,
        lineHeight: 24,
    },
    cardsContainer: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card.dark,
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: colors.primary.DEFAULT,
        backgroundColor: 'rgba(127, 19, 236, 0.1)',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.text.muted,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.surface.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
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
    buttonDisabled: {
        backgroundColor: colors.surface.border,
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text.muted,
    },
});

export default FocusAreaScreen;
