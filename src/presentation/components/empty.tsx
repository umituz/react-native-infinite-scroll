/**
 * Empty Component
 *
 * Presentation component for empty state
 * Follows SOLID, DRY, KISS principles
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Empty: React.FC = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.emptyText}>No items found</Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
