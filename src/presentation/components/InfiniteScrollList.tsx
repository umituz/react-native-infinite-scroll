/**
 * InfiniteScrollList Component
 *
 * Simple, reusable FlatList wrapper with infinite scroll support
 * Follows SOLID, DRY, KISS principles
 */

import React from "react";
import { FlatList, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import type { InfiniteScrollListProps } from "../../domain/entities/InfiniteScroll";

/**
 * Default loading component
 */
const DefaultLoading: React.FC = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" />
  </View>
);

/**
 * Default loading more component
 */
const DefaultLoadingMore: React.FC = () => (
  <View style={styles.loadingMoreContainer}>
    <ActivityIndicator size="small" />
  </View>
);

/**
 * Default empty component
 */
const DefaultEmpty: React.FC = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.emptyText}>No items found</Text>
  </View>
);

/**
 * Default error component
 */
const DefaultError: React.FC<{ error: string; retry: () => void }> = ({
  error,
  retry,
}) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <Text style={styles.retryText} onPress={retry}>
      Tap to retry
    </Text>
  </View>
);

/**
 * InfiniteScrollList Component
 *
 * FlatList wrapper with automatic infinite scroll and pagination
 *
 * @example
 * ```tsx
 * <InfiniteScrollList
 *   config={{
 *     pageSize: 20,
 *     threshold: 5,
 *     fetchData: async (page, pageSize) => {
 *       const response = await api.getItems({ page, limit: pageSize });
 *       return response.data;
 *     },
 *   }}
 *   renderItem={(item) => <ItemCard item={item} />}
 * />
 * ```
 */
export function InfiniteScrollList<T>({
  config,
  renderItem,
  loadingComponent,
  loadingMoreComponent,
  emptyComponent,
  errorComponent,
  ListHeaderComponent,
  ListFooterComponent,
  flatListProps,
}: InfiniteScrollListProps<T>): React.ReactElement {
  const { items, state, loadMore, refresh, canLoadMore } = useInfiniteScroll(config);

  const handleEndReached = React.useCallback(() => {
    if (canLoadMore && config.autoLoad !== false) {
      loadMore();
    }
  }, [canLoadMore, loadMore, config.autoLoad]);

  const getItemKey = React.useCallback(
    (item: T, index: number): string => {
      if (config.getItemKey) {
        return config.getItemKey(item, index);
      }
      return `item-${index}`;
    },
    [config],
  );

  // Loading state
  if (state.isLoading) {
    return loadingComponent || <DefaultLoading />;
  }

  // Error state
  if (state.error) {
    if (errorComponent) {
      return errorComponent(state.error, refresh);
    }
    return <DefaultError error={state.error} retry={refresh} />;
  }

  // Empty state
  if (items.length === 0 && !state.isLoading) {
    return emptyComponent || <DefaultEmpty />;
  }

  // Render list
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item, index) => getItemKey(item, index)}
      onEndReached={handleEndReached}
      onEndReachedThreshold={config.threshold ? config.threshold / 100 : 0.1}
      onRefresh={refresh}
      refreshing={state.isRefreshing}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        <>
          {ListFooterComponent}
          {state.isLoadingMore && (loadingMoreComponent || <DefaultLoadingMore />)}
        </>
      }
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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

