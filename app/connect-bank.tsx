import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { monoAPI } from '../lib/mono';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonoProvider, useMonoConnect } from '@mono.co/connect-react-native';

function ConnectBankScreenContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const { init } = useMonoConnect();

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem('connected_accounts');
      if (storedAccounts) {
        setConnectedAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.error('Error loading connected accounts:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleConnectBank = () => {
    try {
      setIsConnecting(true);
      console.log('Initializing Mono Connect...');

      // Initialize Mono Connect
      init();
    } catch (error) {
      console.error('Error initializing Mono Connect:', error);
      setIsConnecting(false);
      Alert.alert(
        'Connection Error',
        'Failed to initialize Mono Connect. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleConnectSuccess = async (data: { id: string }) => {
    console.log('Mono Connect Success:', data);
    setIsConnecting(false);

    try {
      // Store the connection data
      const connectionData = {
        id: data.id,
        accountId: data.id,
        institution: { name: 'Bank Account' },
        connectedAt: new Date().toISOString(),
        code: data.id, // Use the ID as the authorization code
      };

      console.log('Saving connection data:', connectionData);

      // Save to AsyncStorage
      const existingAccounts = await AsyncStorage.getItem('connected_accounts');
      const accounts = existingAccounts ? JSON.parse(existingAccounts) : [];
      accounts.push(connectionData);
      await AsyncStorage.setItem('connected_accounts', JSON.stringify(accounts));

      // Update state
      setConnectedAccounts(accounts);

      Alert.alert(
        'Success!',
        'Bank account connected successfully!',
        [
          { text: 'View Accounts', onPress: () => router.back() },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error saving connection:', error);
      Alert.alert('Error', 'Failed to save connection data');
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    Alert.alert(
      'Disconnect Account',
      'Are you sure you want to disconnect this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAccounts = connectedAccounts.filter(
                account => account.accountId !== accountId
              );
              await AsyncStorage.setItem('connected_accounts', JSON.stringify(updatedAccounts));
              setConnectedAccounts(updatedAccounts);
              Alert.alert('Success', 'Account disconnected successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to disconnect account');
            }
          }
        }
      ]
    );
  };

  const handleSyncAccounts = async () => {
    setIsLoading(true);

    try {
      // Use the stored authorization codes to fetch account details
      const accountPromises = connectedAccounts.map(async (account) => {
        if (account.code) {
          // Exchange the code for account details
          const result = await monoAPI.getAccountByCode(account.code);
          return result;
        }
        return null;
      });

      const results = await Promise.all(accountPromises);
      const successfulResults = results.filter(r => r && r.success);

      Alert.alert(
        'Sync Complete',
        `Successfully synced ${successfulResults.length} of ${connectedAccounts.length} accounts`
      );

      // Reload accounts to update UI
      await loadConnectedAccounts();
    } catch (error) {
      console.error('Error syncing accounts:', error);
      Alert.alert('Error', 'Failed to sync accounts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Connect Bank Account</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Connect New Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect New Account</Text>
          <Text style={styles.sectionDescription}>
            Securely connect your Nigerian bank account using Mono Connect
          </Text>

          <TouchableOpacity
            style={[styles.connectButton, isConnecting && styles.disabledButton]}
            onPress={handleConnectBank}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="add-circle" size={24} color="white" style={styles.buttonIcon} />
                <Text style={styles.connectButtonText}>Connect Bank Account</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Connected Accounts */}
        {connectedAccounts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Connected Accounts</Text>
              <TouchableOpacity
                style={styles.syncButton}
                onPress={handleSyncAccounts}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#007AFF" size="small" />
                ) : (
                  <Ionicons name="refresh" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            </View>

            {connectedAccounts.map((account, index) => (
              <View key={index} style={styles.accountCard}>
                <View style={styles.accountInfo}>
                  <View style={styles.bankIcon}>
                    <Ionicons name="business" size={24} color="#007AFF" />
                  </View>
                  <View style={styles.accountDetails}>
                    <Text style={styles.accountName}>
                      {account.institution?.name || 'Bank Account'}
                    </Text>
                    <Text style={styles.accountId}>
                      ID: {account.accountId || account.id}
                    </Text>
                    <Text style={styles.connectedDate}>
                      Connected: {new Date(account.connectedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.disconnectButton}
                  onPress={() => handleDisconnectAccount(account.accountId || account.id)}
                >
                  <Ionicons name="trash" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {connectedAccounts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="link-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No Connected Accounts</Text>
            <Text style={styles.emptyStateText}>
              Connect your first bank account to get started
            </Text>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>Tap "Connect Bank Account"</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>Select your bank from the list</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>Enter your bank credentials securely</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4</Text>
              <Text style={styles.instructionText}>Your account data will sync automatically</Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
          <Text style={styles.securityText}>
            Your credentials are encrypted and secure. Mono is bank-level certified.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ConnectBankScreen() {
  const publicKey = process.env.EXPO_PUBLIC_MONO_PUBLIC_KEY || 'test_pk_ttanw4bnxxq8am746j4d';

  const handleSuccess = (data: { id: string }) => {
    console.log('Mono Connect Success:', data);
    // Handle successful connection - router will be available in the component
    Alert.alert(
      'Success!',
      'Bank account connected successfully!',
      [{ text: 'OK' }]
    );
  };

  const handleClose = () => {
    console.log('Mono Connect Closed');
    // Handle close event
  };

  return (
    <MonoProvider
      publicKey={publicKey}
      onSuccess={handleSuccess}
      onClose={handleClose}
    >
      <ConnectBankScreenContent />
    </MonoProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  syncButton: {
    padding: 8,
  },
  accountCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  accountId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  connectedDate: {
    fontSize: 12,
    color: '#666',
  },
  disconnectButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  instructionsList: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8F4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
});