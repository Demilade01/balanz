import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				tabBarInactiveTintColor: "#8E8E93",
				tabBarShowLabel: true,
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "500",
					marginTop: 2,
				},
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].background,
					borderTopColor: "#E5E5EA",
					borderTopWidth: 0.5,
					height: 85,
					paddingTop: 8,
					paddingBottom: 8,
					paddingHorizontal: 16,
				},
			}}
		>
			<Tabs.Screen
				name="HomeScreen"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="CardScreen"
				options={{
					title: "Cards",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "card" : "card-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="ChartScreen"
				options={{
					title: "Analytics",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "stats-chart" : "stats-chart-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="MesageScreen"
				options={{
					title: "Chat",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "chatbubbles" : "chatbubbles-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="HistoryScreen"
				options={{
					title: "History",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "time" : "time-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
