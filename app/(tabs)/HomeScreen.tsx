import { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl } from "react-native";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { syncService } from "../../lib/mono";
import AppBar from "../../components/Home/AppBar";
import UserFinance from "../../components/Home/UserFinance";
import BalenceStats from "../../components/Home/BalenceStats";
import TransferList from "../../components/Home/TransferList";
import ExchangeStats from "../../components/Home/ExchangeStats";
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
			<AppBar />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<UserFinance />
				<BalenceStats />

				{/* Recent Transactions */}
				<RecentTransactions />

				<TransferList />
				<ExchangeStats />

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
						style={[styles.monoTestButton, { backgroundColor: '#28A745' }]}
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
	devToolsContainer: {
		margin: 20,
		padding: 16,
		backgroundColor: '#F8F9FA',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	devToolsTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#666',
		marginBottom: 12,
		textAlign: 'center',
	},
	monoTestButton: {
		backgroundColor: '#007AFF',
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
