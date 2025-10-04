import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/Colors';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError('');
    setGeneralError('');
    setIsEmailValid(validateEmail(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError('');
    setGeneralError('');
  };

  const handleSignIn = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Validate email
    if (!email) {
      setEmailError('Email address is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    // If validation fails, don't proceed with authentication
    if (hasError) return;

    try {
      // Attempt sign in
      const result = await signIn(email, password);

      if (!result.success) {
        // Handle authentication errors - show error immediately
        if (result.error?.includes('email') || result.error?.includes('Invalid login credentials')) {
          setEmailError('Invalid email address');
        } else if (result.error?.includes('password') || result.error?.includes('Invalid login credentials')) {
          setPasswordError('Incorrect password');
        } else if (result.error?.includes('verify your email')) {
          setGeneralError('Please verify your email before signing in');
        } else {
          setGeneralError(result.error || 'Sign in failed. Please try again.');
        }
        return;
      }

      // Success - AuthGuard will handle navigation
      console.log('Sign in successful');
    } catch (error) {
      // Handle unexpected errors
      setGeneralError('Something went wrong. Please try again.');
    }
  };


  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password pressed');
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  const handleBiometricLogin = () => {
    // TODO: Implement biometric login
    console.log('Biometric login pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.background} />


      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.welcomeText}>
          Sign in to continue managing{'\n'}your finances
        </Text>
      </View>

      {/* General Error */}
      {generalError ? (
        <View style={styles.generalErrorContainer}>
          <Ionicons name="alert-circle" size={20} color={Colors.light.danger} />
          <Text style={styles.generalErrorText}>{generalError}</Text>
        </View>
      ) : null}

      {/* Form */}
      <View style={styles.form}>
        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={[
            styles.inputCard,
            emailFocused && styles.inputCardFocused,
            emailError && styles.inputCardError,
            isEmailValid && email.length > 0 && !emailFocused && styles.inputCardSuccess
          ]}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={handleEmailChange}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your email"
              placeholderTextColor={Colors.light.textTertiary}
            />
            {isEmailValid && email.length > 0 && !emailError && (
              <View style={styles.validIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
            {emailError && (
              <Ionicons name="close-circle" size={20} color={Colors.light.danger} />
            )}
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={[
            styles.inputCard,
            passwordFocused && styles.inputCardFocused,
            passwordError && styles.inputCardError
          ]}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={handlePasswordChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your password"
              placeholderTextColor={Colors.light.textTertiary}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={passwordError ? Colors.light.danger : Colors.light.textTertiary}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
        <View style={styles.forgotPasswordCard}>
          <Ionicons name="lock-closed" size={20} color={Colors.light.textSecondary} />
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
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
        <Text style={styles.createAccountText}>Don't have an account? <Text style={styles.createAccountHighlight}>Sign up</Text></Text>
      </TouchableOpacity>

      {/* Biometric Login */}
      <View style={styles.biometricContainer}>
        <Text style={styles.biometricText}>
          Enable <Text style={styles.boldText}>Face Lock</Text> or <Text style={styles.boldText}>Touch Lock</Text>{'\n'}
          for quick sign in
        </Text>
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
          <Ionicons name="finger-print" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.light.danger}20`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.light.danger}40`,
  },
  generalErrorText: {
    fontSize: 14,
    color: Colors.light.danger,
    marginLeft: 8,
    flex: 1,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: Colors.light.borderColor,
    minHeight: 56,
  },
  inputCardFocused: {
    borderColor: Colors.light.tint,
    backgroundColor: `${Colors.light.tint}10`,
  },
  inputCardError: {
    borderColor: Colors.light.danger,
    backgroundColor: `${Colors.light.danger}10`,
  },
  inputCardSuccess: {
    borderColor: Colors.light.success,
    backgroundColor: `${Colors.light.success}10`,
  },
  input: {
    fontSize: 16,
    color: Colors.light.textPrimary,
    flex: 1,
    paddingVertical: 12,
  },
  validIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.danger,
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  forgotPasswordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
  },
  forgotPasswordText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginLeft: 12,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: Colors.light.tint,
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: Colors.light.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  signInButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  createAccountText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  createAccountHighlight: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  biometricContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  biometricText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  biometricButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.tint,
    borderStyle: 'dashed',
  },
});
