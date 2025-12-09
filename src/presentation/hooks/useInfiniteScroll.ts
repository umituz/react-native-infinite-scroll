/**
 * useInfiniteScroll Hook
 * Supports page-based and cursor-based pagination
 * SOLID: Single Responsibility - Orchestrate infinite scroll
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { InfiniteScrollConfig } from "../../domain/types/infinite-scroll-config";
import type { InfiniteScrollState } from "../../domain/types/infinite-scroll-state";
import type { UseInfiniteScrollReturn } from "../../domain/types/infinite-scroll-return";
import { loadData, loadMoreData, isCursorMode } from "./pagination.helper";

const DEFAULT_CONFIG = {
  pageSize: 20,
  threshold: 5,
  autoLoad: true,
  initialPage: 0,
};

function createInitialState<T>(
  initialPage: number,
  totalItems?: number,
): InfiniteScrollState<T> {
  return {
    items: [],
    pages: [],
    currentPage: initialPage,
    cursor: null,
    hasMore: true,
    isLoading: true,
    isLoadingMore: false,
    isRefreshing: false,
    error: null,
    totalItems,
  };
}

export function useInfiniteScroll<T>(
  config: InfiniteScrollConfig<T>,
): UseInfiniteScrollReturn<T> {
  const {
    pageSize = DEFAULT_CONFIG.pageSize,
    autoLoad = DEFAULT_CONFIG.autoLoad,
    totalItems,
    getItemKey,
  } = config;

  const initialPage =
    "initialPage" in config ? config.initialPage || 0 : DEFAULT_CONFIG.initialPage;

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

  const loadInitial = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      const newState = await loadData(config, initialPage, pageSize, totalItems);
      if (isMountedRef.current) {
        setState(newState);
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
  }, [config, initialPage, pageSize, totalItems]);

  const loadMore = useCallback(async () => {
    if (
      isLoadingRef.current ||
      !state.hasMore ||
      state.isLoadingMore ||
      state.isLoading
    ) {
      return;
    }

    if (isCursorMode(config) && !state.cursor) return;

    isLoadingRef.current = true;

    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, isLoadingMore: true, error: null }));
    }

    try {
      const updates = await loadMoreData(config, state, pageSize);
      if (isMountedRef.current) {
        setState((prev) => ({ ...prev, ...updates }));
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
  }, [config, state, pageSize]);

  const refresh = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    if (isMountedRef.current) {
      setState((prev) => ({ ...prev, isRefreshing: true, error: null }));
    }

    try {
      const newState = await loadData(config, initialPage, pageSize, totalItems);
      if (isMountedRef.current) {
        setState(newState);
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
  }, [config, initialPage, pageSize, totalItems]);

  const reset = useCallback(() => {
    isLoadingRef.current = false;
    setState(createInitialState<T>(initialPage, totalItems));
  }, [initialPage, totalItems]);

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
