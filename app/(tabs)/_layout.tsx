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
					marginTop: 0,
				},
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].background,
					borderTopColor: Colors[colorScheme ?? "light"].borderColor,
					borderTopWidth: 0,
					height: 55,
					paddingTop: 0,
					paddingBottom: 0,
					paddingHorizontal: 10,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: -2 },
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: 5,
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
					title: "Insights",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "analytics" : "analytics-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="ProfileScreen"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
