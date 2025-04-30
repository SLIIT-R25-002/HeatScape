import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

export default function CustomPressable({ children, onBegin, onEnd, style }) {
  const [isPressed, setPressed] = useState(false);

  const longPressGesture = Gesture.LongPress()
    .minDuration(20) // Detects long press
    .onStart(() => {
      setPressed(true);
      onBegin();
    })
    .onEnd(() => {
      setPressed(false);
      onEnd();
    })
    .runOnJS(true); // Ensures the callback runs in JavaScript

  return (
    <GestureDetector gesture={longPressGesture}>
      <View style={[styles.button, isPressed && styles.pressed, style]}>
        {children}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
