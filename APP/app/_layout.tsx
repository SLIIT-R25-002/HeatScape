import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

export default function RootLayout() {
  useEffect(() => {
    // Handle initial deep link when app is opened from closed state
    const handleInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        console.log('Initial URL:', initialURL);
      }
    };

    // Handle deep links when app is already running
    const handleURL = (event: { url: string }) => {
      console.log('Deep link received:', event.url);
    };

    handleInitialURL();
    
    const subscription = Linking.addEventListener('url', handleURL);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false}}/>
    </GestureHandlerRootView>
  );
}