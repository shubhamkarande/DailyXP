import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

interface XpGainToastProps {
    visible: boolean;
    xpEarned: number;
    streakBonus: number;
    newStreak: number;
    onHide: () => void;
}

const XpGainToast: React.FC<XpGainToastProps> = ({
    visible,
    xpEarned,
    streakBonus,
    newStreak,
    onHide,
}) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            // Slide in
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide
            const timeout = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(slideAnim, {
                        toValue: -150,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => onHide());
            }, 2500);

            return () => clearTimeout(timeout);
        }
    }, [visible, slideAnim, scaleAnim, onHide]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim },
                    ],
                },
            ]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Icon name="bolt" size={24} color={colors.accent.gold} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.xpText}>+{xpEarned} XP</Text>
                    {streakBonus > 0 && (
                        <Text style={styles.bonusText}>
                            (+{streakBonus} streak bonus)
                        </Text>
                    )}
                </View>
                {newStreak > 0 && (
                    <View style={styles.streakContainer}>
                        <Icon name="local-fire-department" size={18} color={colors.accent.orange} />
                        <Text style={styles.streakText}>{newStreak}</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card.dark,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: colors.primary.DEFAULT,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 193, 7, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    xpText: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.accent.green,
    },
    bonusText: {
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 2,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 159, 28, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    streakText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.accent.orange,
    },
});

export default XpGainToast;
