import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { login, loginAsGuest, clearAuthError, RootState, AppDispatch } from '../../store';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!email || !password) return;
        dispatch(clearAuthError());
        dispatch(login({ email, password }));
    };

    const handleGuestMode = () => {
        dispatch(loginAsGuest());
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.dark} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Icon name="bolt" size={40} color={colors.primary.DEFAULT} />
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>
                        Continue your journey and level up
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {error && (
                        <View style={styles.errorContainer}>
                            <Icon name="error-outline" size={20} color={colors.accent.red} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <Icon name="email" size={20} color={colors.text.muted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.text.muted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="lock" size={20} color={colors.text.muted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.text.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}>
                            <Icon
                                name={showPassword ? 'visibility' : 'visibility-off'}
                                size={20}
                                color={colors.text.muted}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotButton}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, (!email || !password) && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading || !email || !password}
                        activeOpacity={0.8}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={handleGuestMode}
                        disabled={isLoading}>
                        <Icon name="person-outline" size={20} color="#fff" />
                        <Text style={styles.guestButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.footerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.dark,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(127, 19, 236, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.muted,
    },
    form: {
        flex: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
    },
    errorText: {
        color: colors.accent.red,
        fontSize: 14,
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface.dark,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.surface.border,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#fff',
    },
    eyeButton: {
        padding: 8,
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: colors.primary.DEFAULT,
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
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
    loginButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.surface.border,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: colors.text.muted,
    },
    guestButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.card.dark,
        borderWidth: 2,
        borderColor: colors.surface.border,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    guestButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 16,
        color: colors.text.muted,
    },
    footerLink: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
    },
});

export default LoginScreen;
