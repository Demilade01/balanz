import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const getUserDisplayName = () => {
    // Try to get first name from user metadata
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }

    // Fallback to email username
    if (user?.email) {
      return user.email.split('@')[0];
    }

    return 'User';
  };

  const getUserFullName = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }

    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }

    return getUserDisplayName();
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    danger = false
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.profileItemLeft}>
        <View style={[styles.iconContainer, danger && styles.iconContainerDanger]}>
          <Ionicons
            name={icon}
            size={20}
            color={danger ? Colors.light.danger : Colors.light.tint}
          />
        </View>
        <View style={styles.profileItemContent}>
          <Text style={[styles.profileItemTitle, danger && styles.profileItemTitleDanger]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.profileItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showArrow && onPress && (
        <Ionicons name="chevron-forward" size={16} color={Colors.light.textTertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=1" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{getUserFullName()}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.verificationStatus}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} />
                <Text style={styles.verificationText}>Verified Account</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        <ProfileSection title="Account">
          <ProfileItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your profile details"
            onPress={() => {
              // TODO: Navigate to personal info screen
              console.log('Personal info pressed');
            }}
          />
          <ProfileItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Password, 2FA, and security settings"
            onPress={() => {
              // TODO: Navigate to security screen
              console.log('Security pressed');
            }}
          />
          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => {
              // TODO: Navigate to notifications screen
              console.log('Notifications pressed');
            }}
          />
        </ProfileSection>

        <ProfileSection title="Banking">
          <ProfileItem
            icon="card-outline"
            title="Connected Accounts"
            subtitle="Manage your bank accounts"
            onPress={() => {
              // TODO: Navigate to connected accounts screen
              console.log('Connected accounts pressed');
            }}
          />
          <ProfileItem
            icon="wallet-outline"
            title="Payment Methods"
            subtitle="Cards, bank transfers, and more"
            onPress={() => {
              // TODO: Navigate to payment methods screen
              console.log('Payment methods pressed');
            }}
          />
          <ProfileItem
            icon="receipt-outline"
            title="Statements"
            subtitle="Download your account statements"
            onPress={() => {
              // TODO: Navigate to statements screen
              console.log('Statements pressed');
            }}
          />
        </ProfileSection>

        <ProfileSection title="Preferences">
          <ProfileItem
            icon="color-palette-outline"
            title="Appearance"
            subtitle="Theme and display settings"
            onPress={() => {
              // TODO: Navigate to appearance screen
              console.log('Appearance pressed');
            }}
          />
          <ProfileItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => {
              // TODO: Navigate to language screen
              console.log('Language pressed');
            }}
          />
          <ProfileItem
            icon="time-outline"
            title="Currency"
            subtitle="Nigerian Naira (NGN)"
            onPress={() => {
              // TODO: Navigate to currency screen
              console.log('Currency pressed');
            }}
          />
        </ProfileSection>

        <ProfileSection title="Support">
          <ProfileItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="FAQs and support articles"
            onPress={() => {
              // TODO: Navigate to help center
              console.log('Help center pressed');
            }}
          />
          <ProfileItem
            icon="chatbubble-outline"
            title="Contact Support"
            subtitle="Get in touch with our team"
            onPress={() => {
              // TODO: Navigate to contact support
              console.log('Contact support pressed');
            }}
          />
          <ProfileItem
            icon="star-outline"
            title="Rate App"
            subtitle="Share your feedback"
            onPress={() => {
              // TODO: Open app store rating
              console.log('Rate app pressed');
            }}
          />
        </ProfileSection>

        <ProfileSection title="Account Actions">
          <ProfileItem
            icon="log-out-outline"
            title="Sign Out"
            onPress={handleSignOut}
            danger={true}
            showArrow={false}
          />
        </ProfileSection>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Balanz v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Balanz. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.tint,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verificationText: {
    fontSize: 14,
    color: Colors.light.success,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.light.tint}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerDanger: {
    backgroundColor: `${Colors.light.danger}15`,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },
  profileItemTitleDanger: {
    color: Colors.light.danger,
  },
  profileItemSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
});

export default ProfileScreen;
