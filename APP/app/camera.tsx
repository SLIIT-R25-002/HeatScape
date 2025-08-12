import { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { Gyroscope } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { EventSubscription } from "expo-modules-core";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const gyroData = useRef({ x: 0, y: 0, z: 0 });
  const gyroSubscription = useRef<EventSubscription | null>(null);

  useEffect(() => {
    initializeCamera();
    loadSessionId();
    startGyroscope();
    
    return () => {
      // Cleanup gyroscope subscription
      if (gyroSubscription.current) {
        gyroSubscription.current.remove();
      }
    };
  }, []);

  const initializeCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    await Location.requestForegroundPermissionsAsync();
  };

  const loadSessionId = async () => {
    try {
      const storedSessionId = await AsyncStorage.getItem("currentSessionId");
      setSessionId(storedSessionId);
      if (!storedSessionId) {
        Alert.alert("Error", "No active session found", [
          { text: "Go Back", onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error("Error loading session ID:", error);
    }
  };

  const startGyroscope = () => {
    Gyroscope.setUpdateInterval(500);
    gyroSubscription.current = Gyroscope.addListener((data) => {
      gyroData.current = data;
    });
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !sessionId) {
      Alert.alert("Error", "Camera not ready or no session active");
      return;
    }
    
    setLoading(true);

    try {
      // 1. Take picture
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 0.7,
      });

      if (!photo || !photo.uri) {
        throw new Error("Failed to capture photo.");
      }

      // 2. Get metadata
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      const gyro = gyroData.current;

      // 3. Upload image to Storage
      const imageId = uuidv4();
      const storageRef = ref(storage, `sessions/${sessionId}/${imageId}.jpg`);
      
      // Convert image to blob
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      
      // Upload to Firebase Storage
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      // 4. Save metadata to Firestore
      await addDoc(collection(db, `sessions/${sessionId}/images`), {
        imageUrl,
        timestamp: serverTimestamp(),
        gps: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude
        },
        gyro: {
          pitch: gyro.x,
          roll: gyro.y,
          yaw: gyro.z
        },
        imageId
      });

      Alert.alert("Success", "Photo uploaded successfully!");
      
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }

    setLoading(false);
  };

  const goBack = () => {
    router.back();
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="camera-alt" size={64} color="#ccc" />
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginTop: 10, backgroundColor: "#666" }]} onPress={goBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        {/* Header with session info */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionText}>Session: {sessionId}</Text>
          </View>
        </View>

        {/* Camera controls */}
        <View style={styles.controls}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Uploading...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <MaterialIcons name="camera-alt" size={32} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 12,
  },
  sessionInfo: {
    flex: 1,
    alignItems: "center",
  },
  sessionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  controls: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 40,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
