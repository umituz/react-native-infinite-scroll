/**
 * Loading Component
 *
 * Presentation component for loading state
 * Follows SOLID, DRY, KISS principles
 */

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export const Loading: React.FC = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" />
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
