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
import { supabase } from '../lib/supabase';
import Colors from '../constants/Colors';
import LoadingOverlay from '../components/LoadingOverlay';

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Focus states
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    setFirstNameError('');
    setGeneralError('');
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    setLastNameError('');
    setGeneralError('');
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

  const handleSignUp = async () => {
    // Clear previous errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Validate first name
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    } else if (firstName.trim().length < 2) {
      setFirstNameError('First name must be at least 2 characters');
      hasError = true;
    }

    // Validate last name
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasError = true;
    } else if (lastName.trim().length < 2) {
      setLastNameError('Last name must be at least 2 characters');
      hasError = true;
    }

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

    if (hasError) return;

    setIsLoading(true);

    try {
      // Create account with email/password and email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: 'balanz://auth/callback',
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`,
          }
        },
      });

      if (error) {
        if (error.message.includes('email')) {
          setEmailError('Email address is already in use');
        } else if (error.message.includes('password')) {
          setPasswordError('Password is too weak');
        } else {
          setGeneralError(error.message);
        }
        return;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          // Email already confirmed, go to main app
          router.push('/(tabs)');
        } else {
          // Email confirmation required, navigate to OTP screen
          router.push({
            pathname: '/otp',
            params: { email: email, firstName: firstName.trim() }
          });
        }
      }
    } catch (error) {
      setGeneralError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.background} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={24} color={Colors.light.tint} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.description}>
          Join Balanz to start managing{'\n'}your personal finances
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
        {/* First Name Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <View style={[
            styles.inputCard,
            firstNameFocused && styles.inputCardFocused,
            firstNameError && styles.inputCardError,
            firstName.trim().length >= 2 && !firstNameFocused && !firstNameError && styles.inputCardSuccess
          ]}>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={handleFirstNameChange}
              onFocus={() => setFirstNameFocused(true)}
              onBlur={() => setFirstNameFocused(false)}
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="Enter your first name"
              placeholderTextColor={Colors.light.textTertiary}
            />
            {firstName.trim().length >= 2 && !firstNameError && (
              <View style={styles.validIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
            {firstNameError && (
              <Ionicons name="close-circle" size={20} color={Colors.light.danger} />
            )}
          </View>
          {firstNameError ? (
            <Text style={styles.errorText}>{firstNameError}</Text>
          ) : null}
        </View>

        {/* Last Name Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <View style={[
            styles.inputCard,
            lastNameFocused && styles.inputCardFocused,
            lastNameError && styles.inputCardError,
            lastName.trim().length >= 2 && !lastNameFocused && !lastNameError && styles.inputCardSuccess
          ]}>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={handleLastNameChange}
              onFocus={() => setLastNameFocused(true)}
              onBlur={() => setLastNameFocused(false)}
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="Enter your last name"
              placeholderTextColor={Colors.light.textTertiary}
            />
            {lastName.trim().length >= 2 && !lastNameError && (
              <View style={styles.validIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
            {lastNameError && (
              <Ionicons name="close-circle" size={20} color={Colors.light.danger} />
            )}
          </View>
          {lastNameError ? (
            <Text style={styles.errorText}>{lastNameError}</Text>
          ) : null}
        </View>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={[
            styles.inputCard,
            emailFocused && styles.inputCardFocused,
            emailError && styles.inputCardError,
            isEmailValid && email.length > 0 && !emailFocused && !emailError && styles.inputCardSuccess
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
            passwordError && styles.inputCardError,
            password.length >= 6 && !passwordFocused && !passwordError && styles.inputCardSuccess
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
              placeholder="Create a password"
              placeholderTextColor={Colors.light.textTertiary}
            />
            {password.length >= 6 && !passwordError && (
              <View style={styles.validIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
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

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signin')}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      <LoadingOverlay visible={isLoading} message="Creating account..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 15,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  description: {
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
    marginBottom: 20,
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
  signUpButton: {
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
  signUpButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  signInLink: {
    fontSize: 15,
    color: Colors.light.tint,
    fontWeight: '600',
  },
});

