/**
 * Pagination Helper
 * SOLID: Single Responsibility - Handle pagination operations
 */

import type { InfiniteScrollConfig, PaginatedResult } from "../../domain/types/infinite-scroll-config";
import type { InfiniteScrollState } from "../../domain/types/infinite-scroll-state";

export function isCursorMode<T>(
  config: InfiniteScrollConfig<T>,
): config is Extract<InfiniteScrollConfig<T>, { paginationMode: "cursor" }> {
  return "paginationMode" in config && config.paginationMode === "cursor";
}

export async function loadData<T>(
  config: InfiniteScrollConfig<T>,
  pageOrCursor: number | string | undefined,
  pageSize: number,
  totalItems?: number,
): Promise<InfiniteScrollState<T>> {
  if (isCursorMode(config)) {
    const result = await config.fetchCursor(pageOrCursor as string | undefined, pageSize);
    return {
      items: result.items,
      pages: [result.items],
      currentPage: 0,
      cursor: result.nextCursor,
      hasMore: result.hasMore,
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      error: null,
      totalItems,
    };
  } else {
    const data = await config.fetchData(pageOrCursor as number, pageSize);
    const hasMore = data.length >= pageSize;
    return {
      items: data,
      pages: [data],
      currentPage: pageOrCursor as number,
      cursor: null,
      hasMore,
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      error: null,
      totalItems,
    };
  }
}

export async function loadMoreData<T>(
  config: InfiniteScrollConfig<T>,
  state: InfiniteScrollState<T>,
  pageSize: number,
): Promise<Partial<InfiniteScrollState<T>>> {
  if (isCursorMode(config)) {
    if (!state.cursor) throw new Error("No cursor available");
    const result = await config.fetchCursor(state.cursor, pageSize);
    return {
      items: [...state.items, ...result.items],
      pages: [...state.pages, result.items],
      cursor: result.nextCursor,
      hasMore: result.hasMore,
      isLoadingMore: false,
      error: null,
    };
  } else {
    const nextPage = state.currentPage + 1;
    const data = await config.fetchData(nextPage, pageSize);
    const newPages = [...state.pages, data];
    const hasMore = data.length >= pageSize;
    return {
      items: newPages.flat(),
      pages: newPages,
      currentPage: nextPage,
      hasMore,
      isLoadingMore: false,
      error: null,
    };
  }
}
