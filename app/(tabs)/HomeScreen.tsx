import { View, StyleSheet, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import AppBar from "../../components/Home/AppBar";
import UserFinance from "../../components/Home/UserFinance";
import BalenceStats from "../../components/Home/BalenceStats";
import TransferList from "../../components/Home/TransferList";
import ExchangeStats from "../../components/Home/ExchangeStats";

const HomeScreen = () => {
	return (
		<View style={styles.container}>
			<StatusBar style={"light"} />
			<AppBar />
			<ScrollView>
				<UserFinance />
				<BalenceStats />

				<TransferList />
				<ExchangeStats />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
});

export default HomeScreen;
