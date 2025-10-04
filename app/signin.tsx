import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const result = await signIn(email, password);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Sign in failed');
      return;
    }

    // Success - AuthGuard will handle navigation
    console.log('Sign in successful');
  };

  const handleBack = () => {
    router.back();
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  const handleBiometricLogin = () => {
    Alert.alert('Biometric Login', 'Face Lock or Touch Lock coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.welcomeText}>
          Welcome back! You can continue{'\n'}to manage your finances
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {isEmailValid && email.length > 0 && (
              <View style={styles.validIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
          </View>
          <View style={styles.separator} />
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
        <View style={styles.forgotPasswordCard}>
          <Ionicons name="lock-closed" size={20} color="#000" />
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          <Text style={styles.chevronText}>&gt;&gt;</Text>
        </View>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity
        style={[styles.signInButton, loading && styles.disabledButton]}
        onPress={handleSignIn}
        disabled={loading}
      >
        <Text style={styles.signInButtonText}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>

      {/* Biometric Login */}
      <View style={styles.biometricContainer}>
        <Text style={styles.biometricText}>
          Enable <Text style={styles.boldText}>Face Lock</Text> or <Text style={styles.boldText}>Touch Lock</Text>{'\n'}
          for quick sign in
        </Text>
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
          <Ionicons name="finger-print" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    paddingVertical: 12,
  },
  validIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 8,
  },
  forgotPasswordContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  forgotPasswordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  forgotPasswordText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  chevronText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  createAccountText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  biometricText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  biometricButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
});
