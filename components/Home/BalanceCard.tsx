import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { syncService } from '../../lib/mono';
import Colors from '../../constants/Colors';

const BalanceCard = () => {
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, [user]);

  const loadFinancialData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const accountsResult = await syncService.getUserAccounts(user.id);

      if (accountsResult.success && accountsResult.data) {
        const userAccounts = accountsResult.data;
        setAccounts(userAccounts);

        // Calculate total balance
        const total = userAccounts.reduce((sum: number, account: any) => sum + account.balance, 0);
        setTotalBalance(total);
      }
    } catch (error) {
      console.error('Error loading balance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amountMinor: number, currency = 'NGN') => {
    const amount = amountMinor / 100;

    switch (currency) {
      case 'NGN':
        return `₦${amount.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      case 'USD':
        return `$${amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      default:
        return `${currency} ${amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
    }
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.light.tint} size="small" />
          <Text style={styles.loadingText}>Loading balance...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeButton}>
          <Ionicons
            name={showBalance ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={Colors.light.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          {showBalance ? formatCurrency(totalBalance) : '••••••••'}
        </Text>
        <View style={styles.balanceDetails}>
          <View style={styles.accountInfo}>
            <Ionicons name="wallet-outline" size={16} color={Colors.light.textSecondary} />
            <Text style={styles.accountCount}>
              {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.connectButton}>
            <Ionicons name="add-circle-outline" size={16} color={Colors.light.tint} />
            <Text style={styles.connectText}>Connect Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₦0</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₦0</Text>
          <Text style={styles.statLabel}>Last Month</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₦0</Text>
          <Text style={styles.statLabel}>Savings</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${Colors.light.tint}15`,
    borderRadius: 16,
  },
  connectText: {
    fontSize: 12,
    color: Colors.light.tint,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderColor,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.borderColor,
    marginHorizontal: 16,
  },
});

export default BalanceCard;
