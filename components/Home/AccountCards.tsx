import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { syncService } from '../../lib/mono';
import Colors from '../../constants/Colors';

interface Account {
  id: string;
  bank_name: string;
  account_name: string;
  balance: number;
  currency: string;
  type: string;
}

const AccountCards = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, [user]);

  const loadAccounts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await syncService.getUserAccounts(user.id);

      if (result.success && result.data) {
        setAccounts(result.data as Account[]);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
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

  const getAccountIcon = (bankName: string) => {
    const bank = bankName.toLowerCase();
    if (bank.includes('access')) return 'bank-outline';
    if (bank.includes('gtb')) return 'bank-outline';
    if (bank.includes('zenith')) return 'bank-outline';
    if (bank.includes('first')) return 'bank-outline';
    return 'card-outline';
  };

  const getAccountTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'savings':
        return '#4CAF50';
      case 'current':
        return '#2196F3';
      case 'credit':
        return '#FF9800';
      default:
        return Colors.light.tint;
    }
  };

  const renderAccountCard = (account: Account) => (
    <TouchableOpacity key={account.id} style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.bankInfo}>
          <View style={[styles.accountIcon, { backgroundColor: `${getAccountTypeColor(account.type)}20` }]}>
            <Ionicons
              name={getAccountIcon(account.bank_name) as any}
              size={20}
              color={getAccountTypeColor(account.type)}
            />
          </View>
          <View style={styles.accountDetails}>
            <Text style={styles.bankName}>{account.bank_name}</Text>
            <Text style={styles.accountName}>{account.account_name}</Text>
          </View>
        </View>
        <View style={styles.accountType}>
          <Text style={[styles.typeText, { color: getAccountTypeColor(account.type) }]}>
            {account.type?.toUpperCase() || 'ACCOUNT'}
          </Text>
        </View>
      </View>

      <View style={styles.accountBalance}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(account.balance, account.currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Accounts</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.light.tint} size="small" />
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      </View>
    );
  }

  if (accounts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Accounts</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="card-outline" size={48} color={Colors.light.textTertiary} />
          <Text style={styles.emptyTitle}>No Accounts Connected</Text>
          <Text style={styles.emptyText}>
            Connect your bank accounts to start managing your finances
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Accounts</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        style={styles.scrollView}
      >
        {accounts.map(renderAccountCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  scrollView: {
    paddingLeft: 20,
  },
  cardsContainer: {
    paddingRight: 20,
    gap: 16,
  },
  accountCard: {
    width: 280,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },
  accountName: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  accountType: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  accountBalance: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderColor,
    paddingTop: 16,
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AccountCards;
