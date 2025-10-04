import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

const QuickActions = () => {
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      id: 'transfer',
      title: 'Transfer',
      icon: 'swap-horizontal-outline',
      color: '#FFFFFF',
      backgroundColor: Colors.light.tint,
      onPress: () => {
        // TODO: Navigate to transfer screen
        console.log('Transfer pressed');
      },
    },
    {
      id: 'pay',
      title: 'Pay Bills',
      icon: 'receipt-outline',
      color: '#FFFFFF',
      backgroundColor: '#FF6B35',
      onPress: () => {
        // TODO: Navigate to bills screen
        console.log('Pay bills pressed');
      },
    },
    {
      id: 'topup',
      title: 'Top Up',
      icon: 'add-circle-outline',
      color: '#FFFFFF',
      backgroundColor: '#4CAF50',
      onPress: () => {
        // TODO: Navigate to top up screen
        console.log('Top up pressed');
      },
    },
    {
      id: 'invest',
      title: 'Invest',
      icon: 'trending-up-outline',
      color: '#FFFFFF',
      backgroundColor: '#9C27B0',
      onPress: () => {
        // TODO: Navigate to investment screen
        console.log('Invest pressed');
      },
    },
    {
      id: 'save',
      title: 'Save',
      icon: 'bookmark-outline',
      color: '#FFFFFF',
      backgroundColor: '#FF9800',
      onPress: () => {
        // TODO: Navigate to savings screen
        console.log('Save pressed');
      },
    },
    {
      id: 'cards',
      title: 'Cards',
      icon: 'card-outline',
      color: '#FFFFFF',
      backgroundColor: '#607D8B',
      onPress: () => {
        router.push('/(tabs)/CardScreen');
      },
    },
  ];

  const renderAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.actionButton, { backgroundColor: action.backgroundColor }]}
      onPress={action.onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionIconContainer}>
        <Ionicons name={action.icon} size={24} color={action.color} />
      </View>
      <Text style={[styles.actionTitle, { color: action.color }]}>
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
        style={styles.scrollView}
      >
        {actions.map(renderAction)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingLeft: 20,
  },
  actionsContainer: {
    paddingRight: 20,
    gap: 12,
  },
  actionButton: {
    width: 80,
    height: 100,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default QuickActions;
