import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import Colors from "../../constants/Colors";

const CardScreen = () => {
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState(0);

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const cards = [
    {
      id: 1,
      type: 'Virtual',
      number: '**** **** **** 1234',
      name: getUserDisplayName(),
      expiry: '12/26',
      brand: 'Visa',
      balance: 50000,
      color: '#2A49FB',
      isActive: true,
    },
    {
      id: 2,
      type: 'Physical',
      number: '**** **** **** 5678',
      name: getUserDisplayName(),
      expiry: '08/27',
      brand: 'Mastercard',
      balance: 75000,
      color: '#FF6B35',
      isActive: true,
    },
    {
      id: 3,
      type: 'Business',
      number: '**** **** **** 9012',
      name: `${getUserDisplayName()} Business`,
      expiry: '05/28',
      brand: 'Visa',
      balance: 120000,
      color: '#4CAF50',
      isActive: false,
    },
  ];

  const cardActions = [
    {
      id: 'freeze',
      title: 'Freeze Card',
      icon: 'snow-outline',
      color: '#2196F3',
    },
    {
      id: 'unfreeze',
      title: 'Unfreeze Card',
      icon: 'sunny-outline',
      color: '#FF9800',
    },
    {
      id: 'pin',
      title: 'Change PIN',
      icon: 'lock-closed-outline',
      color: '#9C27B0',
    },
    {
      id: 'limits',
      title: 'Set Limits',
      icon: 'speedometer-outline',
      color: '#607D8B',
    },
    {
      id: 'statements',
      title: 'Statements',
      icon: 'document-text-outline',
      color: '#795548',
    },
    {
      id: 'block',
      title: 'Block Card',
      icon: 'ban-outline',
      color: '#F44336',
    },
  ];

  const handleCardAction = (action: string) => {
    Alert.alert(
      action.charAt(0).toUpperCase() + action.slice(1),
      `Are you sure you want to ${action.toLowerCase()} this card?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`${action} confirmed`) }
      ]
    );
  };

  const VirtualCard = ({ card, isSelected, onPress }: { card: any; isSelected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.cardContainer, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.card, { backgroundColor: card.color }]}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTypeContainer}>
            <Text style={styles.cardType}>{card.type}</Text>
            {!card.isActive && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveText}>INACTIVE</Text>
              </View>
            )}
          </View>
          <View style={styles.cardBrand}>
            <Text style={styles.brandText}>{card.brand}</Text>
          </View>
        </View>

        {/* Card Number */}
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>{card.number}</Text>
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{card.name}</Text>
            <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
          </View>
          <View style={styles.cardBalance}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceAmount}>
              ₦{card.balance.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ActionButton = ({ action }: { action: any }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => handleCardAction(action.id)}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
        <Ionicons name={action.icon as any} size={24} color={action.color} />
      </View>
      <Text style={styles.actionText}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>My Cards</Text>
            <Text style={styles.headerSubtitle}>Manage your cards and payments</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Cards Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Cards</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cardsScrollView}
              contentContainerStyle={styles.cardsContainer}
            >
              {cards.map((card, index) => (
                <VirtualCard
                  key={card.id}
                  card={card}
                  isSelected={selectedCard === index}
                  onPress={() => setSelectedCard(index)}
                />
              ))}
            </ScrollView>

            {/* Card Indicators */}
            <View style={styles.cardIndicators}>
              {cards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    selectedCard === index && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {cardActions.map((action) => (
                <ActionButton key={action.id} action={action} />
              ))}
            </View>
          </View>

          {/* Card Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card Type</Text>
                <Text style={styles.detailValue}>{cards[selectedCard].type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card Number</Text>
                <Text style={styles.detailValue}>{cards[selectedCard].number}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expiry Date</Text>
                <Text style={styles.detailValue}>{cards[selectedCard].expiry}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: cards[selectedCard].isActive ? Colors.light.success : Colors.light.danger }
                  ]} />
                  <Text style={[
                    styles.detailValue,
                    { color: cards[selectedCard].isActive ? Colors.light.success : Colors.light.danger }
                  ]}>
                    {cards[selectedCard].isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 16,
  },
  cardsScrollView: {
    marginHorizontal: -20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardContainer: {
    width: 320,
    marginRight: 16,
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
  },
  card: {
    height: 200,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inactiveText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  cardBrand: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  cardNumberContainer: {
    marginBottom: 24,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardBalance: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  cardIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.borderColor,
  },
  activeIndicator: {
    backgroundColor: Colors.light.tint,
    width: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    width: '47%',
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default CardScreen;
