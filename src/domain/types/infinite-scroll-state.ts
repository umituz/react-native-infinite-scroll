/**
 * Infinite Scroll State Types
 *
 * Domain types for infinite scroll state management
 * Follows SOLID, DRY, KISS principles
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
