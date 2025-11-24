/**
 * useInfiniteScroll Hook
 *
 * Presentation hook for infinite scroll functionality
 * Follows SOLID, DRY, KISS principles
 * Single Responsibility: Orchestrate infinite scroll operations
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { InfiniteScrollConfig } from "../../domain/types/infinite-scroll-config";
import type { InfiniteScrollState } from "../../domain/types/infinite-scroll-state";
import type { UseInfiniteScrollReturn } from "../../domain/types/infinite-scroll-return";
import { StateManagerService } from "../../application/services/state-manager.service";
import { InfiniteScrollService } from "../../application/services/infinite-scroll.service";
import { LoadMoreUseCase } from "../../application/use-cases/load-more.use-case";

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
  // Merge config with defaults
  const mergedConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
    }),
    [config],
  );

  // Initialize services
  const infiniteScrollService = useMemo(
    () => new InfiniteScrollService(mergedConfig),
    [mergedConfig],
  );

  const initialState: InfiniteScrollState<T> = useMemo(
    () => ({
      items: [],
      pages: [],
      currentPage: mergedConfig.initialPage,
      hasMore: true,
      isLoading: true,
      isLoadingMore: false,
      isRefreshing: false,
      error: null,
      totalItems: mergedConfig.totalItems,
    }),
    [mergedConfig.initialPage, mergedConfig.totalItems],
  );

  const stateManager = useMemo(
    () => new StateManagerService(initialState),
    [initialState],
  );

  const loadMoreUseCase = useMemo(
    () => new LoadMoreUseCase(stateManager, infiniteScrollService),
    [stateManager, infiniteScrollService],
  );

  const [state, setState] = useState<InfiniteScrollState<T>>(initialState);
  const isLoadingRef = useRef(false);

  // Sync state updates
  useEffect(() => {
    const unsubscribe = () => {}; // Could implement observer pattern here
    const updateState = () => setState(stateManager.getState());

    // Initial sync
    updateState();

    return unsubscribe;
  }, [stateManager]);

  /**
   * Load initial data
   */
  const loadInitial = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    stateManager.setLoading(true);
    stateManager.setError(null);

    try {
      const data = await infiniteScrollService.loadPage(mergedConfig.initialPage);
      const hasMore = infiniteScrollService.checkHasMore(data, [data]);

      stateManager.setInitialData(data, hasMore, mergedConfig.totalItems);
    } catch (error) {
      stateManager.setError(
        error instanceof Error ? error.message : "Failed to load data"
      );
      stateManager.setLoading(false);
    } finally {
      isLoadingRef.current = false;
    }
  }, [infiniteScrollService, stateManager, mergedConfig]);

  /**
   * Load more items
   */
  const loadMore = useCallback(async () => {
    await loadMoreUseCase.execute();
  }, [loadMoreUseCase]);

  /**
   * Refresh all data
   */
  const refresh = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    stateManager.setRefreshing(true);
    stateManager.setError(null);

    try {
      const data = await infiniteScrollService.loadPage(mergedConfig.initialPage);
      const hasMore = infiniteScrollService.checkHasMore(data, [data]);

      stateManager.setInitialData(data, hasMore, mergedConfig.totalItems);
    } catch (error) {
      stateManager.setError(
        error instanceof Error ? error.message : "Failed to refresh data"
      );
      stateManager.setRefreshing(false);
    } finally {
      isLoadingRef.current = false;
    }
  }, [infiniteScrollService, stateManager, mergedConfig]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    stateManager.reset(mergedConfig.initialPage, mergedConfig.totalItems);
    isLoadingRef.current = false;
  }, [stateManager, mergedConfig]);

  /**
   * Load initial data on mount
   */
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const canLoadMore = stateManager.canLoadMore();

  return {
    items: state.items,
    state,
    loadMore,
    refresh,
    reset,
    canLoadMore,
  };
}
