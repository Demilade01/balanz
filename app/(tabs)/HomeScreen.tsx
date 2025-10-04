import { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl } from "react-native";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { syncService } from "../../lib/mono";

// Modern components
import ModernHeader from "../../components/Home/ModernHeader";
import BalanceCard from "../../components/Home/BalanceCard";
import QuickActions from "../../components/Home/QuickActions";
import AccountCards from "../../components/Home/AccountCards";
import RecentTransactions from "../../components/Home/RecentTransactions";

const HomeScreen = () => {
	const router = useRouter();
	const { user } = useAuth();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		if (!user?.id) return;

		setRefreshing(true);
		try {
			// Sync all user accounts to get latest data
			await syncService.syncUserAccounts(user.id);
		} catch (error) {
			console.error('Error refreshing data:', error);
		} finally {
			setRefreshing(false);
		}
	}, [user]);

	return (
		<View style={styles.container}>
			<StatusBar style={"light"} />

			{/* Modern Header */}
			<ModernHeader />

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={Colors.light.tint}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				{/* Balance Card */}
				<BalanceCard />

				{/* Quick Actions */}
				<QuickActions />

				{/* Account Cards */}
				<AccountCards />

				{/* Recent Transactions */}
				<RecentTransactions />

				{/* Development Tools */}
				<View style={styles.devToolsContainer}>
					<Text style={styles.devToolsTitle}>Development Tools</Text>

					<TouchableOpacity
						style={styles.monoTestButton}
						onPress={() => router.push('/mono-test')}
					>
						<Text style={styles.monoTestText}>Test Mono API</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.monoTestButton, { backgroundColor: Colors.light.success }]}
						onPress={() => router.push('/connect-bank')}
					>
						<Text style={styles.monoTestText}>Connect Bank Account</Text>
					</TouchableOpacity>
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
	scrollContent: {
		paddingBottom: 100, // Space for tab bar
	},
	devToolsContainer: {
		margin: 20,
		marginTop: 30,
		padding: 16,
		backgroundColor: Colors.light.cardBackground,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.light.borderColor,
	},
	devToolsTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.textSecondary,
		marginBottom: 12,
		textAlign: 'center',
	},
	monoTestButton: {
		backgroundColor: Colors.light.info,
		marginVertical: 8,
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	monoTestText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default HomeScreen;
