/**
 * InfiniteScrollList Component
 *
 * Presentation component for infinite scroll list
 * Follows SOLID, DRY, KISS principles
 * Single Responsibility: Render infinite scroll list
 */

import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { calculateEndReachedThreshold } from "../../domain/utils/pagination-utils";
import type { InfiniteScrollListProps } from "../../domain/interfaces/infinite-scroll-list-props";
import { Loading } from "./loading";
import { LoadingMore } from "./loading-more";
import { Empty } from "./empty";
import { Error } from "./error";

/**
 * Render error component
 */
function renderErrorComponent(
  error: string,
  retry: () => void,
  errorComponent?: (error: string, retry: () => void) => React.ReactElement,
): React.ReactElement {
  if (errorComponent) {
    return errorComponent(error, retry);
  }
  return <Error error={error} onRetry={retry} />;
}

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
    return loadingComponent || <Loading />;
  }

  // Error state
  if (state.error) {
    return renderErrorComponent(state.error, refresh, errorComponent);
  }

  // Empty state
  if (items.length === 0 && !state.isLoading) {
    return emptyComponent || <Empty />;
  }

  // Render list
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item, index) => getItemKey(item, index)}
      onEndReached={handleEndReached}
      onEndReachedThreshold={calculateEndReachedThreshold(config.threshold)}
      onRefresh={refresh}
      refreshing={state.isRefreshing}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        <>
          {ListFooterComponent}
          {state.isLoadingMore && (loadingMoreComponent || <LoadingMore />)}
        </>
      }
      {...flatListProps}
    />
  );
}
