/**
 * State Manager Service
 *
 * Application service for managing infinite scroll state
 * Follows SOLID, DRY, KISS principles
 * Single Responsibility: State management operations
 */

import type { InfiniteScrollState } from "../../domain/types/infinite-scroll-state";

export class StateManagerService<T> {
  private state: InfiniteScrollState<T>;

  constructor(initialState: InfiniteScrollState<T>) {
    this.state = { ...initialState };
  }

  /**
   * Get current state
   */
  getState(): InfiniteScrollState<T> {
    return { ...this.state };
  }

  /**
   * Update state with partial changes
   */
  updateState(updates: Partial<InfiniteScrollState<T>>): void {
    this.state = { ...this.state, ...updates };
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  /**
   * Set loading more state
   */
  setLoadingMore(isLoadingMore: boolean): void {
    this.updateState({ isLoadingMore });
  }

  /**
   * Set refreshing state
   */
  setRefreshing(isRefreshing: boolean): void {
    this.updateState({ isRefreshing });
  }

  /**
   * Set error state
   */
  setError(error: string | null): void {
    this.updateState({ error });
  }

  /**
   * Add new page of items
   */
  addPage(pageData: T[], hasMore: boolean): void {
    const newPages = [...this.state.pages, pageData];
    const newItems = newPages.flat();

    this.updateState({
      pages: newPages,
      items: newItems,
      currentPage: this.state.currentPage + 1,
      hasMore,
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      error: null,
    });
  }

  /**
   * Set initial data
   */
  setInitialData(data: T[], hasMore: boolean, totalItems?: number): void {
    this.updateState({
      items: data,
      pages: [data],
      currentPage: 0,
      hasMore,
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      error: null,
      totalItems,
    });
  }

  /**
   * Reset to initial state
   */
  reset(initialPage = 0, totalItems?: number): void {
    this.state = {
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
   * Check if can load more
   */
  canLoadMore(): boolean {
    return (
      this.state.hasMore &&
      !this.state.isLoadingMore &&
      !this.state.isLoading
    );
  }
}
