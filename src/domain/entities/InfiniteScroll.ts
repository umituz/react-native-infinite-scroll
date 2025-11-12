/**
 * Infinite Scroll Domain Entities
 *
 * Core types and interfaces for infinite scroll functionality
 */

import type React from "react";

/**
 * Configuration for infinite scroll behavior
 */
export interface InfiniteScrollConfig<T> {
  /**
   * Total number of items available (optional, for progress tracking)
   */
  totalItems?: number;

  /**
   * Number of items to load per page
   * Default: 20
   */
  pageSize?: number;

  /**
   * Number of items from the end to trigger loading more
   * Default: 5 (loads more when 5 items from bottom)
   */
  threshold?: number;

  /**
   * Enable automatic loading when threshold is reached
   * Default: true
   */
  autoLoad?: boolean;

  /**
   * Initial page number (0-indexed)
   * Default: 0
   */
  initialPage?: number;

  /**
   * Function to fetch data for a specific page
   * @param page - Page number (0-indexed)
   * @param pageSize - Number of items per page
   * @returns Promise resolving to array of items
   */
  fetchData: (page: number, pageSize: number) => Promise<T[]>;

  /**
   * Optional: Function to check if there are more items
   * If not provided, checks if last page has fewer items than pageSize
   * @param lastPage - Last fetched page of items
   * @param allPages - All fetched pages
   * @returns true if there are more items to load
   */
  hasMore?: (lastPage: T[], allPages: T[][]) => boolean;

  /**
   * Optional: Function to get unique key for each item
   * If not provided, uses array index
   * @param item - Item to get key for
   * @param index - Item index
   * @returns Unique key string
   */
  getItemKey?: (item: T, index: number) => string;
}

/**
 * State of infinite scroll
 */
export interface InfiniteScrollState<T> {
  /**
   * All loaded items (flattened from pages)
   */
  items: T[];

  /**
   * All pages of items
   */
  pages: T[][];

  /**
   * Current page number (0-indexed)
   */
  currentPage: number;

  /**
   * Whether more items are available
   */
  hasMore: boolean;

  /**
   * Whether currently loading initial data
   */
  isLoading: boolean;

  /**
   * Whether currently loading more items
   */
  isLoadingMore: boolean;

  /**
   * Whether currently refreshing
   */
  isRefreshing: boolean;

  /**
   * Error message if any
   */
  error: string | null;

  /**
   * Total number of items (if known)
   */
  totalItems?: number;
}

/**
 * Return type for useInfiniteScroll hook
 */
export interface UseInfiniteScrollReturn<T> {
  /**
   * All loaded items (flattened)
   */
  items: T[];

  /**
   * Current state
   */
  state: InfiniteScrollState<T>;

  /**
   * Load next page of items
   */
  loadMore: () => Promise<void>;

  /**
   * Refresh all data (resets to page 0)
   */
  refresh: () => Promise<void>;

  /**
   * Reset to initial state
   */
  reset: () => void;

  /**
   * Check if can load more
   */
  canLoadMore: boolean;
}

/**
 * Props for InfiniteScrollList component
 */
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

