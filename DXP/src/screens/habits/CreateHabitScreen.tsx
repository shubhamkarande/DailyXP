import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, difficultyConfig } from '../../theme';
import { createHabit, RootState, AppDispatch } from '../../store';

type Difficulty = 'easy' | 'medium' | 'hard';
type Frequency = 'daily' | 'weekly';

const CreateHabitScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.habits);

    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [frequency, setFrequency] = useState<Frequency>('daily');

    const handleCreate = async () => {
        if (!title.trim()) return;

        const result = await dispatch(
            createHabit({
                title: title.trim(),
                difficulty,
                frequency,
                icon: 'check-circle',
            }),
        );

        if (createHabit.fulfilled.match(result)) {
            navigation.goBack();
        }
    };

    const selectedConfig = difficultyConfig[difficulty];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            {/* Background decorations */}
            <View style={styles.bgGrid} />
            <View style={styles.bgGlowTop} />
            <View style={styles.bgGlowLeft} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="close" size={24} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Quest</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}>

                {/* Quest Name */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>QUEST NAME</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Read 10 pages"
                            placeholderTextColor="rgba(173, 146, 201, 0.5)"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TouchableOpacity style={styles.emojiButton}>
                            <Icon name="emoji-emotions" size={24} color={colors.accent.gold} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Frequency */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>FREQUENCY</Text>
                    <View style={styles.frequencyContainer}>
                        <TouchableOpacity
                            style={[
                                styles.frequencyOption,
                                frequency === 'daily' && styles.frequencyOptionActive,
                            ]}
                            onPress={() => setFrequency('daily')}>
                            <Text
                                style={[
                                    styles.frequencyText,
                                    frequency === 'daily' && styles.frequencyTextActive,
                                ]}>
                                Daily
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.frequencyOption,
                                frequency === 'weekly' && styles.frequencyOptionActive,
                            ]}
                            onPress={() => setFrequency('weekly')}>
                            <Text
                                style={[
                                    styles.frequencyText,
                                    frequency === 'weekly' && styles.frequencyTextActive,
                                ]}>
                                Weekly
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Difficulty */}
                <View style={styles.section}>
                    <View style={styles.difficultyHeader}>
                        <Text style={styles.sectionLabel}>DIFFICULTY</Text>
                        <View style={styles.xpMultiplierBadge}>
                            <Text style={styles.xpMultiplierText}>Multiplies XP</Text>
                        </View>
                    </View>
                    <View style={styles.difficultyGrid}>
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => {
                            const config = difficultyConfig[level];
                            const isSelected = difficulty === level;
                            return (
                                <TouchableOpacity
                                    key={level}
                                    style={[
                                        styles.difficultyCard,
                                        isSelected && {
                                            borderColor: config.color,
                                            backgroundColor: `${config.bgColor}`,
                                        },
                                    ]}
                                    onPress={() => setDifficulty(level)}>
                                    <View
                                        style={[
                                            styles.difficultyIcon,
                                            isSelected && { backgroundColor: config.color },
                                        ]}>
                                        <Icon
                                            name={
                                                level === 'easy'
                                                    ? 'star'
                                                    : level === 'medium'
                                                        ? 'hotel-class'
                                                        : 'military-tech'
                                            }
                                            size={18}
                                            color={isSelected ? '#000' : colors.text.muted}
                                        />
                                    </View>
                                    <Text style={styles.difficultyLabel}>{config.label}</Text>
                                    <Text
                                        style={[
                                            styles.difficultyXp,
                                            isSelected && { color: config.color },
                                        ]}>
                                        {config.xp} XP
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* XP Preview */}
                <View style={styles.previewCard}>
                    <View style={styles.previewGlow} />
                    <View style={styles.previewContent}>
                        <View style={styles.previewLeft}>
                            <Text style={styles.previewLabel}>QUEST REWARD</Text>
                            <View style={styles.previewMeta}>
                                <View style={styles.boltIcon}>
                                    <Icon name="bolt" size={16} color={colors.accent.gold} />
                                </View>
                                <Text style={styles.previewMetaText}>Recurring Gain</Text>
                            </View>
                        </View>
                        <View style={styles.previewRight}>
                            <Text style={styles.previewXp}>
                                <Text style={styles.previewXpPlus}>+</Text>
                                {selectedConfig.xp}{' '}
                                <Text style={styles.previewXpLabel}>XP</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.previewNote}>
                    XP is awarded every time you complete this habit.
                </Text>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.createButton, !title.trim() && styles.buttonDisabled]}
                    onPress={handleCreate}
                    disabled={isLoading || !title.trim()}
                    activeOpacity={0.8}>
                    <View style={styles.buttonGlow} />
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.createButtonText}>Accept Quest</Text>
                            <Icon name="keyboard-double-arrow-up" size={24} color="#fff" />
                        </>
                    )}
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
    bgGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.2,
    },
    bgGlowTop: {
        position: 'absolute',
        top: -80,
        right: -80,
        width: 256,
        height: 256,
        backgroundColor: colors.primary.DEFAULT,
        opacity: 0.15,
        borderRadius: 128,
    },
    bgGlowLeft: {
        position: 'absolute',
        top: '50%',
        left: -80,
        width: 192,
        height: 192,
        backgroundColor: '#3b82f6',
        opacity: 0.08,
        borderRadius: 96,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    contentContainer: {
        paddingTop: 8,
        paddingBottom: 120,
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.surface.dark,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.surface.border,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        height: 64,
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
    emojiButton: {
        width: 64,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(77, 50, 103, 0.5)',
    },
    frequencyContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface.dark,
        borderRadius: 28,
        padding: 6,
        borderWidth: 1,
        borderColor: colors.surface.border,
    },
    frequencyOption: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    frequencyOptionActive: {
        backgroundColor: 'rgba(127, 19, 236, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(127, 19, 236, 0.5)',
    },
    frequencyText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text.muted,
    },
    frequencyTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    difficultyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginLeft: 4,
    },
    xpMultiplierBadge: {
        backgroundColor: 'rgba(127, 19, 236, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    xpMultiplierText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
    },
    difficultyGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    difficultyCard: {
        flex: 1,
        height: 112,
        backgroundColor: 'rgba(38, 25, 51, 0.5)',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.surface.border,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    difficultyIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.surface.dark,
        borderWidth: 1,
        borderColor: colors.surface.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    difficultyLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    difficultyXp: {
        fontSize: 12,
        color: colors.text.muted,
    },
    previewCard: {
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(127, 19, 236, 0.5)',
        overflow: 'hidden',
        marginTop: 8,
    },
    previewGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(127, 19, 236, 0.1)',
    },
    previewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: 'rgba(26, 17, 34, 0.9)',
    },
    previewLeft: {
        gap: 8,
    },
    previewLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text.muted,
        letterSpacing: 1,
    },
    previewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    boltIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewMetaText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    previewRight: {},
    previewXp: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
    },
    previewXpPlus: {
        color: colors.primary.DEFAULT,
    },
    previewXpLabel: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
    },
    previewNote: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 40,
    },
    createButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        overflow: 'hidden',
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
    buttonGlow: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 30,
        opacity: 0.6,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});

export default CreateHabitScreen;
