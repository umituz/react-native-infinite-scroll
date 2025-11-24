/**
 * Infinite Scroll List Props Interface
 *
 * Domain interface for component props
 * Follows SOLID, DRY, KISS principles
 */

import type React from "react";
import type { InfiniteScrollConfig } from "../types/infinite-scroll-config";

export interface InfiniteScrollListProps<T> {
  /**
   * Configuration for infinite scroll
   */
  config: InfiniteScrollConfig<T>;

  /**
   * Render function for each item
   */
  renderItem: (item: T, index: number) => React.ReactElement;

  /**
   * Optional: Custom loading component
   */
  loadingComponent?: React.ReactElement;

  /**
   * Optional: Custom loading more component
   */
  loadingMoreComponent?: React.ReactElement;

  /**
   * Optional: Custom empty component
   */
  emptyComponent?: React.ReactElement;

  /**
   * Optional: Custom error component
   */
  errorComponent?: (error: string, retry: () => void) => React.ReactElement;

  /**
   * Optional: List header component
   */
  ListHeaderComponent?: React.ReactElement;

  /**
   * Optional: List footer component
   */
  ListFooterComponent?: React.ReactElement;

  /**
   * Optional: Additional FlatList props
   */
  flatListProps?: Omit<
    React.ComponentProps<typeof import("react-native").FlatList<T>>,
    | "data"
    | "renderItem"
    | "keyExtractor"
    | "onEndReached"
    | "onEndReachedThreshold"
    | "onRefresh"
    | "refreshing"
    | "ListHeaderComponent"
    | "ListFooterComponent"
  >;
}
