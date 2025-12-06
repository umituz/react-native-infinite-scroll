/**
 * useInfiniteScroll Hook
 *
 * Presentation hook for infinite scroll functionality
 * Follows SOLID, DRY, KISS principles
 * Single Responsibility: Orchestrate infinite scroll operations
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { InfiniteScrollConfig } from "../../domain/types/infinite-scroll-config";
import type { InfiniteScrollState } from "../../domain/types/infinite-scroll-state";
import type { UseInfiniteScrollReturn } from "../../domain/types/infinite-scroll-return";

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
 * Create initial state
 */
function createInitialState<T>(
  initialPage: number,
  totalItems?: number,
): InfiniteScrollState<T> {
  return {
    items: [],
    pages: [],
    currentPage: initialPage,
    hasMore: true,
    isLoading: true,
    isLoadingMore: false,
    isRefreshing: false,
    error: null,
    totalItems,
  };
}

/**
 * useInfiniteScroll Hook
 *
 * Manages infinite scroll state and data fetching with proper React state sync
 */
export function useInfiniteScroll<T>(
  config: InfiniteScrollConfig<T>,
): UseInfiniteScrollReturn<T> {
  const {
    pageSize = DEFAULT_CONFIG.pageSize,
    initialPage = DEFAULT_CONFIG.initialPage,
    autoLoad = DEFAULT_CONFIG.autoLoad,
    totalItems,
    fetchData,
    getItemKey,
  } = config;

  const [state, setState] = useState<InfiniteScrollState<T>>(() =>
    createInitialState<T>(initialPage, totalItems),
  );

  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Check if there are more items to load
   */
  const checkHasMore = useCallback(
    (newData: T[], allPages: T[][]): boolean => {
      if (newData.length < pageSize) {
        return false;
      }
      if (totalItems !== undefined) {
        const totalLoaded = allPages.flat().length;
        return totalLoaded < totalItems;
      }
      return true;
    },
    [pageSize, totalItems],
  );

  /**
   * Load initial data
   */
  const loadInitial = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;

    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      const data = await fetchData(initialPage, pageSize);
      const hasMore = checkHasMore(data, [data]);

      if (isMountedRef.current) {
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
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load data",
        }));
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [fetchData, initialPage, pageSize, checkHasMore, totalItems]);

  /**
   * Load more items
   */
  const loadMore = useCallback(async () => {
    if (
      isLoadingRef.current ||
      !state.hasMore ||
      state.isLoadingMore ||
      state.isLoading
    ) {
      return;
    }

    isLoadingRef.current = true;

    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, isLoadingMore: true, error: null }));
    }

    try {
      const nextPage = state.currentPage + 1;
      const data = await fetchData(nextPage, pageSize);
      const newPages = [...state.pages, data];
      const hasMore = checkHasMore(data, newPages);

      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          items: newPages.flat(),
          pages: newPages,
          currentPage: nextPage,
          hasMore,
          isLoadingMore: false,
          error: null,
        }));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoadingMore: false,
          error:
            error instanceof Error ? error.message : "Failed to load more items",
        }));
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    state.hasMore,
    state.isLoadingMore,
    state.isLoading,
    state.currentPage,
    state.pages,
    fetchData,
    pageSize,
    checkHasMore,
  ]);

  /**
   * Refresh all data
   */
  const refresh = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;

    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, isRefreshing: true, error: null }));
    }

    try {
      const data = await fetchData(initialPage, pageSize);
      const hasMore = checkHasMore(data, [data]);

      if (isMountedRef.current) {
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
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          isRefreshing: false,
          error:
            error instanceof Error ? error.message : "Failed to refresh data",
        }));
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [fetchData, initialPage, pageSize, checkHasMore, totalItems]);

  /**
   * Reset to initial state and reload
   */
  const reset = useCallback(() => {
    isLoadingRef.current = false;
    setState(createInitialState<T>(initialPage, totalItems));
  }, [initialPage, totalItems]);

  /**
   * Load initial data on mount
   */
  useEffect(() => {
    if (autoLoad) {
      loadInitial();
    }
  }, [autoLoad, loadInitial]);

  const canLoadMore =
    state.hasMore && !state.isLoadingMore && !state.isLoading;

  return {
    items: state.items,
    state,
    loadMore,
    refresh,
    reset,
    canLoadMore,
  };
}
