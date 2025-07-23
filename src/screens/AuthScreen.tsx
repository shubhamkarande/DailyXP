import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { FirebaseService } from '../services/firebase';
import { setUser, setLoading } from '../store/slices/authSlice';

export const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoadingState] = useState(false);
  const dispatch = useDispatch();

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !displayName)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoadingState(true);
    dispatch(setLoading(true));

    try {
      if (isSignUp) {
        const user = await FirebaseService.signUp(email, password, displayName);
        dispatch(setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName!,
        }));
      } else {
        const userCredential = await FirebaseService.signIn(email, password);
        dispatch(setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName!,
        }));
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-3xl font-bold text-center mb-2 text-gray-800">
            DailyXP
          </Text>
          <Text className="text-center text-gray-600 mb-8">
            Level up your life, one habit at a time
          </Text>

          {isSignUp && (
            <TextInput
              className="bg-gray-100 rounded-xl p-4 mb-4 text-gray-800"
              placeholder="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            className="bg-gray-100 rounded-xl p-4 mb-4 text-gray-800"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="bg-gray-100 rounded-xl p-4 mb-6 text-gray-800"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={handleAuth}
            disabled={loading}
            className="mb-4"
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              className="py-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            className="items-center"
          >
            <Text className="text-blue-600">
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};