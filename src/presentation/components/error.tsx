/**
 * Error Component
 *
 * Presentation component for error state
 * Follows SOLID, DRY, KISS principles
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ErrorProps {
  error: string;
  onRetry: () => void;
}

export const Error: React.FC<ErrorProps> = ({ error, onRetry }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <Text style={styles.retryText} onPress={onRetry}>
      Tap to retry
    </Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: "#1976d2",
    textAlign: "center",
    marginTop: 8,
  },
});
