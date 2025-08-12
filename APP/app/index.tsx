import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const checkExistingSession = async () => {
    try {
      const existingSessionId = await AsyncStorage.getItem('currentSessionId');
      if (existingSessionId) {
        setSessionId(existingSessionId);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
    }
  };

  const handleManualJoin = async () => {
    if (!sessionId.trim()) {
      Alert.alert('Error', 'Please enter a session ID');
      return;
    }
    
    try {
      await AsyncStorage.setItem('currentSessionId', sessionId.trim());
      setIsConnected(true);
      Alert.alert('Success', `Joined session: ${sessionId.trim()}`);
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to join session');
    }
  };

  const handleQRScan = () => {
    router.push('./qr-scanner');
  };

  const handleTakePhoto = () => {
    if (!isConnected) {
      Alert.alert('Error', 'Please join a session first');
      return;
    }

    router.push('./camera');
  };

  const resetSession = async () => {
    try {
      await AsyncStorage.removeItem('currentSessionId');
      setSessionId('');
      setIsConnected(false);
      Alert.alert('Success', 'Left session successfully');
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  };

  useEffect(() => {
    // Check if there's an existing session
    checkExistingSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HeatScape</Text>
        <Text style={styles.subtitle}>Thermal Image Capture</Text>
      </View>

      {!isConnected ? (
        <View style={styles.joinSection}>
          <Text style={styles.sectionTitle}>Join Session</Text>
          
          {/* Manual Session ID Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Session ID</Text>
            <TextInput
              style={styles.textInput}
              value={sessionId}
              onChangeText={setSessionId}
              placeholder="Enter session ID"
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleManualJoin}>
            <MaterialIcons name="login" size={24} color="#fff" />
            <Text style={styles.buttonText}>Join Session</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <Text style={styles.dividerText}>OR</Text>
          </View>

          {/* QR Code Scanner */}
          <TouchableOpacity style={styles.secondaryButton} onPress={handleQRScan}>
            <MaterialIcons name="qr-code-scanner" size={24} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.connectedSection}>
          <View style={styles.statusContainer}>
            <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
            <Text style={styles.connectedText}>Connected to Session</Text>
            <Text style={styles.sessionIdText}>{sessionId}</Text>
          </View>

          <TouchableOpacity style={styles.cameraButton} onPress={handleTakePhoto}>
            <MaterialIcons name="camera-alt" size={48} color="#fff" />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetSession}>
            <MaterialIcons name="exit-to-app" size={24} color="#FF6B6B" />
            <Text style={styles.resetButtonText}>Leave Session</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  joinSection: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  connectedSection: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  connectedText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  sessionIdText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'monospace',
  },
  cameraButton: {
    backgroundColor: '#FF6B35',
    width: width * 0.8,
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  resetButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});