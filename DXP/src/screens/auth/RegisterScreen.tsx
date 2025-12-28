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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { register, clearAuthError, RootState, AppDispatch } from '../../store';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;
type RouteType = RouteProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteType>();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const focusAreas = route.params?.focusAreas || [];

    const handleRegister = () => {
        if (!username || !email || !password) return;
        dispatch(clearAuthError());
        dispatch(register({ email, password, username, focusAreas }));
    };

    const isValid = username.length >= 2 && email.includes('@') && password.length >= 6;

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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Start your XP journey today
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
                        <Icon name="person" size={20} color={colors.text.muted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor={colors.text.muted}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

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
                            placeholder="Password (min 6 characters)"
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

                    <TouchableOpacity
                        style={[styles.registerButton, !isValid && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading || !isValid}
                        activeOpacity={0.8}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.footerLink}>Login</Text>
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
        paddingBottom: 40,
    },
    header: {
        height: 80,
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        marginBottom: 32,
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
    registerButton: {
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
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
    registerButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    termsText: {
        fontSize: 12,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 18,
    },
    termsLink: {
        color: colors.primary.DEFAULT,
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

export default RegisterScreen;
