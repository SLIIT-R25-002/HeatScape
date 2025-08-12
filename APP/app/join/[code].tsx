import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Linking from 'expo-linking';

export default function JoinPage() {
  const { code } = useLocalSearchParams<{ code: string }>();

  useEffect(() => {
    if (code) {
      handleJoinCode(code);
    }
  }, [code]);

  const handleJoinCode = (joinCode: string) => {
    // Handle the join code here
    console.log('Received join code:', joinCode);
    
    // Example: Show an alert with the code
    Alert.alert(
      'Join Code Received',
      `Join code: ${joinCode}`,
      [
        {
          text: 'Cancel',
          onPress: () => router.back(),
        },
        {
          text: 'Join',
          onPress: () => {
            // Add your join logic here
            console.log('Joining with code:', joinCode);
            router.push('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joining with code: {code}</Text>
      <Text style={styles.subtitle}>Processing your join request...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
