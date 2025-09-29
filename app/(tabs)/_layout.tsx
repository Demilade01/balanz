import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import {
	AntDesign,
	Feather,
	Ionicons,
	MaterialIcons,
} from "@expo/vector-icons";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				tabBarShowLabel: false,
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].background,
					borderTopColor: Colors[colorScheme ?? "light"].background,
					height: 56,
					paddingVertical: 6,
				},
			}}
		>
			<Tabs.Screen
				name="HomeScreen"
				options={{
					tabBarIcon: ({ color }) => (
						<AntDesign name={"home"} size={25} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="CardScreen"
				options={{
					tabBarIcon: ({ color }) => (
						<Feather name={"credit-card"} size={25} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="ChartScreen"
				options={{
					tabBarIcon: ({ color }) => (
						<AntDesign name={"linechart"} size={25} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="MesageScreen"
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="chatbox-ellipses-outline" size={25} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="HistoryScreen"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialIcons name={"history"} size={25} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
