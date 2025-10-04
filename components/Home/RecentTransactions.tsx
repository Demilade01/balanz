import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { syncService } from '../../lib/mono';

interface Transaction {
  id: string;
  posted_at: string;
  amount_minor: number;
  currency: string;
  description: string;
  merchant: string | null;
  category_id: string | null;
  is_manual: boolean;
  created_at: string;
  accounts?: {
    bank_name: string;
    account_name: string;
  }[];
  categories?: {
    name: string;
    icon: string;
    color: string;
    is_income: boolean;
    is_expense: boolean;
  }[];
}

const RecentTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentTransactions();
  }, [user]);

  const loadRecentTransactions = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get recent transactions (last 5)
      const result = await syncService.getUserTransactions(user.id, 5, 0);

      if (result.success && result.data) {
        setTransactions(result.data as Transaction[]);
      }
    } catch (error) {
      console.error('Error loading recent transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amountMinor: number, currency = 'NGN') => {
    const amount = amountMinor / 100;

    switch (currency) {
      case 'NGN':
        return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'USD':
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.categories && transaction.categories.length > 0) {
      return transaction.categories[0].icon;
    }

    if (transaction.amount_minor > 0) {
      return 'arrow-down-circle'; // Income
    } else {
      return 'arrow-up-circle'; // Expense
    }
  };

  const getTransactionColor = (transaction: Transaction) => {
    if (transaction.categories && transaction.categories.length > 0) {
      return transaction.categories[0].color;
    }

    if (transaction.amount_minor > 0) {
      return '#4CAF50'; // Green for income
    } else {
      return '#F44336'; // Red for expense
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(item) + '20' }]}>
          <Ionicons
            name={getTransactionIcon(item) as any}
            size={20}
            color={getTransactionColor(item)}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {item.description || item.merchant || 'Unknown Transaction'}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.posted_at)}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          { color: item.amount_minor > 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {item.amount_minor > 0 ? '+' : ''}{formatCurrency(item.amount_minor, item.currency)}
        </Text>
        {item.categories && item.categories.length > 0 && (
          <Text style={styles.transactionCategory}>
            {item.categories[0].name}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#007AFF" size="small" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={48} color="#CCC" />
          <Text style={styles.emptyTitle}>No Transactions Yet</Text>
          <Text style={styles.emptyText}>
            Connect a bank account to see your transactions
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#303339',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#303339',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#303339',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 52,
  },
});

export default RecentTransactions;
