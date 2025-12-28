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

interface LevelUpModalProps {
    visible: boolean;
    previousLevel: number;
    newLevel: number;
    onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
    visible,
    previousLevel,
    newLevel,
    onClose,
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const starAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);
            glowAnim.setValue(0);
            starAnims.forEach(anim => anim.setValue(0));

            // Start animations
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.parallel([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(glowAnim, {
                                toValue: 1,
                                duration: 1000,
                                useNativeDriver: true,
                            }),
                            Animated.timing(glowAnim, {
                                toValue: 0,
                                duration: 1000,
                                useNativeDriver: true,
                            }),
                        ]),
                    ),
                ]),
            ]).start();

            // Animate stars
            starAnims.forEach((anim, index) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.delay(index * 100),
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ]),
                ).start();
            });
        }
    }, [visible, scaleAnim, rotateAnim, glowAnim, starAnims]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Stars animation (replacing confetti) */}
                {starAnims.map((anim, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.star,
                            {
                                left: `${10 + (index * 11)}%`,
                                top: `${15 + ((index % 3) * 20)}%`,
                                opacity: anim,
                                transform: [{
                                    scale: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1.5],
                                    }),
                                }],
                            },
                        ]}>
                        <Icon name="star" size={24} color={index % 2 === 0 ? colors.accent.gold : colors.primary.light} />
                    </Animated.View>
                ))}

                {/* Content */}
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}>
                    {/* Glow effect */}
                    <Animated.View
                        style={[
                            styles.glow,
                            { opacity: glowOpacity },
                        ]}
                    />

                    {/* Main card */}
                    <View style={styles.card}>
                        {/* Level badge */}
                        <Animated.View
                            style={[
                                styles.badgeContainer,
                                { transform: [{ rotate: spin }] },
                            ]}>
                            <View style={styles.badge}>
                                <Icon name="emoji-events" size={40} color={colors.accent.gold} />
                            </View>
                        </Animated.View>

                        {/* Text */}
                        <Text style={styles.title}>LEVEL UP!</Text>
                        <View style={styles.levelContainer}>
                            <Text style={styles.levelOld}>LVL {previousLevel}</Text>
                            <Icon name="arrow-forward" size={24} color={colors.primary.DEFAULT} />
                            <Text style={styles.levelNew}>LVL {newLevel}</Text>
                        </View>
                        <Text style={styles.message}>
                            You're becoming a legend! Keep up the great work.
                        </Text>

                        {/* Button */}
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Awesome!</Text>
                            <Icon name="celebration" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.85,
        alignItems: 'center',
    },
    star: {
        position: 'absolute',
    },
    glow: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        backgroundColor: colors.primary.DEFAULT,
    },
    card: {
        width: '100%',
        backgroundColor: colors.card.dark,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary.DEFAULT,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 20,
    },
    badgeContainer: {
        marginBottom: 24,
    },
    badge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 193, 7, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.accent.gold,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.accent.gold,
        letterSpacing: 4,
        marginBottom: 16,
        textShadowColor: colors.accent.gold,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    levelOld: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.muted,
    },
    levelNew: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
    },
    message: {
        fontSize: 16,
        color: colors.text.muted,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primary.DEFAULT,
        paddingHorizontal: 32,
        height: 52,
        borderRadius: 26,
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});

export default LevelUpModal;
