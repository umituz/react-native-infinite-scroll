/**
 * useInfiniteScroll Hook
 *
 * Custom hook for managing infinite scroll state and data fetching
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  InfiniteScrollConfig,
  InfiniteScrollState,
  UseInfiniteScrollReturn,
} from "../../domain/entities/InfiniteScroll";

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  pageSize: 20,
  threshold: 5,
  autoLoad: true,
  initialPage: 0,
};

/**
 * Default hasMore function
 * Checks if last page has fewer items than pageSize
 */
function defaultHasMore<T>(
  lastPage: T[],
  _allPages: T[][],
  pageSize: number,
): boolean {
  return lastPage.length >= pageSize;
}

/**
 * useInfiniteScroll Hook
 *
 * Manages infinite scroll state and data fetching
 *
 * @example
 * ```tsx
 * const { items, loadMore, refresh, canLoadMore, isLoading } = useInfiniteScroll({
 *   pageSize: 20,
 *   threshold: 5,
 *   fetchData: async (page, pageSize) => {
 *     const response = await api.getItems({ page, limit: pageSize });
 *     return response.data;
 *   },
 * });
 * ```
 */
export function useInfiniteScroll<T>(
  config: InfiniteScrollConfig<T>,
): UseInfiniteScrollReturn<T> {
  const {
    pageSize = DEFAULT_CONFIG.pageSize,
    threshold = DEFAULT_CONFIG.threshold,
    autoLoad = DEFAULT_CONFIG.autoLoad,
    initialPage = DEFAULT_CONFIG.initialPage,
    fetchData,
    hasMore: customHasMore,
    totalItems,
  } = config;

  const [state, setState] = useState<InfiniteScrollState<T>>({
    items: [],
    pages: [],
    currentPage: initialPage,
    hasMore: true,
    isLoading: true,
    isLoadingMore: false,
    isRefreshing: false,
    error: null,
    totalItems,
  });

  const isLoadingRef = useRef(false);

  /**
   * Check if there are more items to load
   */
  const checkHasMore = useCallback(
    (lastPage: T[], allPages: T[][]): boolean => {
      if (customHasMore) {
        return customHasMore(lastPage, allPages);
      }
      return defaultHasMore(lastPage, allPages, pageSize);
    },
    [customHasMore, pageSize],
  );

  /**
   * Load data for a specific page
   */
  const loadPage = useCallback(
    async (page: number): Promise<T[]> => {
      try {
        const data = await fetchData(page, pageSize);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load data";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
        }));
        throw error;
      }
    },
    [fetchData, pageSize],
  );

  /**
   * Load initial data
   */
  const loadInitial = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const data = await loadPage(initialPage);
      const hasMore = checkHasMore(data, [data]);

      setState({
        items: data,
        pages: [data],
        currentPage: initialPage,
        hasMore,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
        error: null,
        totalItems,
      });
    } catch (error) {
      // Error already handled in loadPage
    } finally {
      isLoadingRef.current = false;
    }
  }, [initialPage, loadPage, checkHasMore, totalItems]);

  /**
   * Load more items (next page)
   */
  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !state.hasMore || state.isLoadingMore) {
      return;
    }

    isLoadingRef.current = true;
    setState((prev) => ({
      ...prev,
      isLoadingMore: true,
      error: null,
    }));

    try {
      const nextPage = state.currentPage + 1;
      const data = await loadPage(nextPage);
      const newPages = [...state.pages, data];
      const newItems = newPages.flat();
      const hasMore = checkHasMore(data, newPages);

      setState({
        items: newItems,
        pages: newPages,
        currentPage: nextPage,
        hasMore,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
        error: null,
        totalItems,
      });
    } catch (error) {
      // Error already handled in loadPage
    } finally {
      isLoadingRef.current = false;
    }
  }, [state, loadPage, checkHasMore, totalItems]);

  /**
   * Refresh all data (reset to initial page)
   */
  const refresh = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setState((prev) => ({
      ...prev,
      isRefreshing: true,
      error: null,
    }));

    try {
      const data = await loadPage(initialPage);
      const hasMore = checkHasMore(data, [data]);

      setState({
        items: data,
        pages: [data],
        currentPage: initialPage,
        hasMore,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
        error: null,
        totalItems,
      });
    } catch (error) {
      // Error already handled in loadPage
    } finally {
      isLoadingRef.current = false;
    }
  }, [initialPage, loadPage, checkHasMore, totalItems]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setState({
      items: [],
      pages: [],
      currentPage: initialPage,
      hasMore: true,
      isLoading: true,
      isLoadingMore: false,
      isRefreshing: false,
      error: null,
      totalItems,
    });
    isLoadingRef.current = false;
  }, [initialPage, totalItems]);

  /**
   * Load initial data on mount
   */
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const canLoadMore = state.hasMore && !state.isLoadingMore && !state.isLoading;

  return {
    items: state.items,
    state,
    loadMore,
    refresh,
    reset,
    canLoadMore,
  };
}

