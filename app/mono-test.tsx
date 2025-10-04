import React, { useState } from 'react';
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

export default function MonoTestScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    status?: number;
    data?: string;
    error?: string;
  } | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  const handleBack = () => {
    router.back();
  };

  const testAPIConnection = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      const result = await monoAPI.testConnection();
      setTestResults(result);

      if (result.success) {
        Alert.alert('Success', 'Mono API connection successful!');
      } else {
        Alert.alert('Error', `API test failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to test API connection: ${errorMessage}`);
      setTestResults({ success: false, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    setAccounts([]);

    try {
      const result = await monoAPI.getAccounts();

      if (result.success) {
        const data = result.data as any;
        const accountsList = data?.data || [];
        setAccounts(accountsList);
        Alert.alert('Success', `Found ${accountsList.length} accounts`);
      } else {
        Alert.alert('Error', `Failed to fetch accounts: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to fetch accounts: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const connectBankAccount = () => {
    Alert.alert(
      'Connect Bank Account',
      'This will open the Mono Connect widget to link your bank account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: () => {
          // TODO: Implement Mono Connect widget
          Alert.alert('Coming Soon', 'Mono Connect widget integration coming soon!');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Mono API Test</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* API Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Status</Text>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={testAPIConnection}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Test API Connection</Text>
            )}
          </TouchableOpacity>

          {testResults && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Test Results:</Text>
              <Text style={[styles.resultText, testResults.success ? styles.successText : styles.errorText]}>
                Status: {testResults.success ? 'Success' : 'Failed'}
              </Text>
              {testResults.status && (
                <Text style={styles.resultText}>HTTP Status: {testResults.status}</Text>
              )}
              {testResults.data && (
                <Text style={styles.resultText}>Response: {testResults.data}</Text>
              )}
              {testResults.error && (
                <Text style={styles.errorText}>Error: {testResults.error}</Text>
              )}
            </View>
          )}
        </View>

        {/* Accounts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Accounts</Text>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, isLoading && styles.disabledButton]}
            onPress={fetchAccounts}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Fetch Accounts</Text>
            )}
          </TouchableOpacity>

          {accounts.length > 0 && (
            <View style={styles.accountsContainer}>
              <Text style={styles.accountsTitle}>Connected Accounts:</Text>
              {accounts.map((account, index) => (
                <View key={index} style={styles.accountCard}>
                  <Text style={styles.accountName}>{account.name || 'Unknown Account'}</Text>
                  <Text style={styles.accountNumber}>
                    {account.accountNumber || 'No account number'}
                  </Text>
                  <Text style={styles.accountBalance}>
                    Balance: ₦{account.balance || '0.00'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Connect Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect New Account</Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={connectBankAccount}
          >
            <Text style={styles.buttonText}>Connect Bank Account</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            1. Make sure you have valid Mono API keys in your environment{'\n'}
            2. Test the API connection first{'\n'}
            3. Connect a bank account using Mono Connect{'\n'}
            4. Fetch and view your accounts
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#000',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  resultContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#F44336',
  },
  accountsContainer: {
    marginTop: 16,
  },
  accountsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  accountCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
