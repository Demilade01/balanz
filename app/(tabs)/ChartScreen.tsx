import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { syncService } from '../../lib/mono';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const ChartScreen = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [insights, setInsights] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    topCategories: [] as any[],
    spendingTrend: 'up' as string,
    budgetProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  const categories = [
    { name: 'Food & Dining', amount: 45000, percentage: 35, color: '#FF6B35', icon: 'restaurant' },
    { name: 'Transportation', amount: 28000, percentage: 22, color: '#2196F3', icon: 'car' },
    { name: 'Shopping', amount: 32000, percentage: 25, color: '#9C27B0', icon: 'bag' },
    { name: 'Entertainment', amount: 18000, percentage: 14, color: '#4CAF50', icon: 'musical-notes' },
    { name: 'Bills & Utilities', amount: 8000, percentage: 4, color: '#FF9800', icon: 'flash' },
  ];

  const insightsData = [
    {
      id: 'savings',
      title: 'Savings Rate',
      value: '23%',
      change: '+5%',
      trend: 'up',
      icon: 'trending-up',
      color: '#4CAF50',
    },
    {
      id: 'spending',
      title: 'Avg Daily Spend',
      value: '₦4,200',
      change: '-12%',
      trend: 'down',
      icon: 'trending-down',
      color: '#FF6B35',
    },
    {
      id: 'income',
      title: 'Monthly Income',
      value: '₦180,000',
      change: '+8%',
      trend: 'up',
      icon: 'arrow-up',
      color: '#2196F3',
    },
    {
      id: 'budget',
      title: 'Budget Used',
      value: '77%',
      change: 'On Track',
      trend: 'neutral',
      icon: 'checkmark-circle',
      color: '#FF9800',
    },
  ];

  useEffect(() => {
    loadInsights();
  }, [user, selectedPeriod]);

  const loadInsights = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement actual insights loading from transactions
      // For now, using mock data
      setInsights({
        totalIncome: 180000,
        totalExpenses: 131000,
        netSavings: 49000,
        topCategories: categories,
        spendingTrend: 'up',
        budgetProgress: 77,
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const InsightCard = ({ insight }: { insight: any }) => (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
          <Ionicons name={insight.icon as any} size={24} color={insight.color} />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Text style={styles.insightValue}>{insight.value}</Text>
        </View>
      </View>
      <View style={styles.insightFooter}>
        <View style={[
          styles.trendContainer,
          insight.trend === 'up' && styles.trendUp,
          insight.trend === 'down' && styles.trendDown,
        ]}>
          <Ionicons
            name={insight.trend === 'up' ? 'arrow-up' : insight.trend === 'down' ? 'arrow-down' : 'remove'}
            size={12}
            color={insight.trend === 'up' ? '#4CAF50' : insight.trend === 'down' ? '#F44336' : '#FF9800'}
          />
          <Text style={[
            styles.trendText,
            { color: insight.trend === 'up' ? '#4CAF50' : insight.trend === 'down' ? '#F44336' : '#FF9800' }
          ]}>
            {insight.change}
          </Text>
        </View>
      </View>
    </View>
  );

  const CategoryItem = ({ category }: { category: any }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
          <Ionicons name={category.icon as any} size={20} color={category.color} />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
        </View>
      </View>
      <View style={styles.categoryRight}>
        <Text style={styles.categoryAmount}>{formatCurrency(category.amount)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${category.percentage}%`,
            backgroundColor: category.color
          }]} />
        </View>
      </View>
    </View>
  );

  const SimpleChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Spending Trend</Text>
      <View style={styles.chart}>
        {[65, 45, 80, 35, 90, 55, 75].map((height, index) => (
          <View key={index} style={styles.chartBar}>
            <View
              style={[
                styles.bar,
                {
                  height: `${height}%`,
                  backgroundColor: index === 6 ? Colors.light.tint : `${Colors.light.tint}60`
                }
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.chartLabels}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, index) => (
          <Text key={index} style={styles.chartLabel}>{label}</Text>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading insights...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Insights</Text>
            <Text style={styles.headerSubtitle}>Track your financial progress</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.id && styles.selectedPeriodButton
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.selectedPeriodText
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Key Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            <View style={styles.insightsGrid}>
              {insightsData.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </View>
          </View>

          {/* Spending Chart */}
          <View style={styles.section}>
            <SimpleChart />
          </View>

          {/* Spending by Category */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Spending by Category</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoriesList}>
              {categories.map((category, index) => (
                <CategoryItem key={index} category={category} />
              ))}
            </View>
          </View>

          {/* Budget Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Progress</Text>
            <View style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetTitle}>Monthly Budget</Text>
                <Text style={styles.budgetAmount}>₦170,000 / ₦220,000</Text>
              </View>
              <View style={styles.budgetProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '77%', backgroundColor: Colors.light.tint }]} />
                </View>
                <Text style={styles.budgetPercentage}>77% Used</Text>
              </View>
              <Text style={styles.budgetRemaining}>₦50,000 remaining this month</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="add-circle-outline" size={24} color={Colors.light.tint} />
                <Text style={styles.actionText}>Set Budget</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="analytics-outline" size={24} color={Colors.light.tint} />
                <Text style={styles.actionText}>View Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="notifications-outline" size={24} color={Colors.light.tint} />
                <Text style={styles.actionText}>Set Alerts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="download-outline" size={24} color={Colors.light.tint} />
                <Text style={styles.actionText}>Export Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.light.cardBackground,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  selectedPeriodText: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
    width: '48%',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  insightFooter: {
    alignItems: 'flex-end',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendUp: {
    backgroundColor: '#4CAF5015',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendDown: {
    backgroundColor: '#F4433615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 8,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  chartLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 8,
  },
  progressBar: {
    width: 120,
    height: 6,
    backgroundColor: Colors.light.borderColor,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  budgetCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  budgetAmount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  budgetProgress: {
    marginBottom: 12,
  },
  budgetPercentage: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  budgetRemaining: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ChartScreen;
