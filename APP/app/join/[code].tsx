import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JoinPage() {
  const { code } = useLocalSearchParams<{ code: string }>();

  useEffect(() => {
    if (code) {
      handleJoinCode(code);
    }
  }, [code]);

  const handleJoinCode = async (joinCode: string) => {
    try {
      // Save the session ID to AsyncStorage
      await AsyncStorage.setItem('currentSessionId', joinCode);
      
      console.log('Received join code:', joinCode);
      
      // Show success alert and navigate to camera
      Alert.alert(
        'Session Joined',
        `Successfully joined session: ${joinCode}`,
        [
          {
            text: 'Take Photos',
            onPress: () => {
              router.replace('./camera');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error joining session:', error);
      Alert.alert(
        'Error',
        'Failed to join session. Please try again.',
        [
          {
            text: 'Go Back',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joining Session...</Text>
      <Text style={styles.subtitle}>Session ID: {code}</Text>
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
