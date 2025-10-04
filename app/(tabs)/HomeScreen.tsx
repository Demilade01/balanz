import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AppBar from "../../components/Home/AppBar";
import UserFinance from "../../components/Home/UserFinance";
import BalenceStats from "../../components/Home/BalenceStats";
import TransferList from "../../components/Home/TransferList";
import ExchangeStats from "../../components/Home/ExchangeStats";

const HomeScreen = () => {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<StatusBar style={"light"} />
			<AppBar />
			<ScrollView>
				<UserFinance />
				<BalenceStats />

				<TransferList />
				<ExchangeStats />

				{/* Mono Test Button */}
				<TouchableOpacity
					style={styles.monoTestButton}
					onPress={() => router.push('/mono-test')}
				>
					<Text style={styles.monoTestText}>Test Mono API</Text>
				</TouchableOpacity>

				{/* Connect Bank Button */}
				<TouchableOpacity
					style={[styles.monoTestButton, { backgroundColor: '#28A745' }]}
					onPress={() => router.push('/connect-bank')}
				>
					<Text style={styles.monoTestText}>Connect Bank Account</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	monoTestButton: {
		backgroundColor: '#007AFF',
		margin: 20,
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
