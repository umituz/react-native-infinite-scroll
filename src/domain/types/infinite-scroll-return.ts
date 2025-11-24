/**
 * Infinite Scroll Return Types
 *
 * Domain types for hook return values
 * Follows SOLID, DRY, KISS principles
 */

import type { InfiniteScrollState } from "./infinite-scroll-state";

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
