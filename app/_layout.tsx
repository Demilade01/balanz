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
	const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

	useEffect(() => {
		const checkOnboardingStatus = async () => {
			try {
				const value = await AsyncStorage.getItem('hasSeenOnboarding');
				setHasSeenOnboarding(value === 'true');
			} catch (error) {
				console.error('Error checking onboarding status:', error);
				setHasSeenOnboarding(false);
			}
		};

		checkOnboardingStatus();
	}, []);

	if (hasSeenOnboarding === null) {
		return null; // Still loading
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="onboarding" options={{ headerShown: false }} />
					<Stack.Screen name="signup" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					{/*<Stack.Screen name="modal" options={{ presentation: 'modal' }} />*/}
				</Stack>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
