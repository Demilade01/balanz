import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";
import { AuthGuard } from "../components/AuthGuard";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "onboarding",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<AuthProvider>
					<AuthGuard>
						<Stack>
							<Stack.Screen name="onboarding" options={{ headerShown: false }} />
							<Stack.Screen name="signin" options={{ headerShown: false }} />
							<Stack.Screen name="signup" options={{ headerShown: false }} />
							<Stack.Screen name="otp" options={{ headerShown: false }} />
							<Stack.Screen name="verification-success" options={{ headerShown: false }} />
							<Stack.Screen name="mono-test" options={{ headerShown: false }} />
							<Stack.Screen name="connect-bank" options={{ headerShown: false }} />
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
							{/*<Stack.Screen name="modal" options={{ presentation: 'modal' }} />*/}
						</Stack>
					</AuthGuard>
				</AuthProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
