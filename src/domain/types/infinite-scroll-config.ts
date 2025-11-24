/**
 * Infinite Scroll Configuration Types
 *
 * Domain types for infinite scroll configuration
 * Follows SOLID, DRY, KISS principles
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
