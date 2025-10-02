import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <View style={styles.crescent} />
        </View>
        <Text style={styles.logoText}>Balanz</Text>
      </View>

      {/* Credit Card Illustration */}
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#4ECDC4', '#44A08D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          {/* Chip */}
          <View style={styles.chip}>
            <View style={styles.chipInner} />
          </View>

          {/* Brand Logo */}
          <View style={styles.brandLogo}>
            <View style={styles.brandCrescent} />
          </View>

          {/* Card Number */}
          <Text style={styles.cardNumber}>**** **** **** 1234</Text>

          {/* Cardholder Name */}
          <Text style={styles.cardholderName}>Balanz User</Text>
        </LinearGradient>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.headline}>
          Unify your{'\n'}Nigerian finances
        </Text>

        <Text style={styles.description}>
          Connect your bank accounts, track transactions, and manage your money all in one place.
        </Text>

        {/* Navigation Arrows */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.arrowText}>&gt;&gt;&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  crescent: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  card: {
    width: width * 0.8,
    height: 200,
    borderRadius: 16,
    padding: 20,
    transform: [{ rotate: '5deg' }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    position: 'absolute',
    top: 20,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: 30,
    height: 20,
    backgroundColor: '#FFA500',
    borderRadius: 2,
  },
  brandLogo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
  },
  brandCrescent: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 60,
    textAlign: 'center',
  },
  cardholderName: {
    color: 'white',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    lineHeight: 38,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
    marginBottom: 40,
    opacity: 0.9,
  },
  navigationContainer: {
    alignItems: 'flex-start',
  },
  arrowButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  arrowText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
});
