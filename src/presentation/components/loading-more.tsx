/**
 * Loading More Component
 *
 * Presentation component for loading more state
 * Follows SOLID, DRY, KISS principles
 */

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export const LoadingMore: React.FC = () => (
  <View style={styles.loadingMoreContainer}>
    <ActivityIndicator size="small" />
  </View>
);

const styles = StyleSheet.create({
  loadingMoreContainer: {
    padding: 16,
    alignItems: "center",
  },
});
