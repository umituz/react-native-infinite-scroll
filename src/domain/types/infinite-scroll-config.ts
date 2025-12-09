/**
 * Infinite Scroll Configuration Types
 *
 * Domain types for infinite scroll configuration
 * Follows SOLID, DRY, KISS principles
 */

/**
 * Paginated result for cursor-based pagination
 */
export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Base configuration shared by all pagination modes
 */
interface BaseConfig<T> {
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
   * Optional: Function to get unique key for each item
   * If not provided, uses array index
   * @param item - Item to get key for
   * @param index - Item index
   * @returns Unique key string
   */
  getItemKey?: (item: T, index: number) => string;
}

/**
 * Page-based pagination configuration (default, backward compatible)
 */
export interface PageBasedConfig<T> extends BaseConfig<T> {
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
}

/**
 * Cursor-based pagination configuration (new, for Firestore)
 */
export interface CursorBasedConfig<T> extends BaseConfig<T> {
  /**
   * Discriminator for cursor-based mode
   */
  paginationMode: "cursor";

  /**
   * Function to fetch data using cursor
   * @param cursor - Cursor for next page (undefined for first page)
   * @param pageSize - Number of items per page
   * @returns Promise resolving to paginated result with cursor
   */
  fetchCursor: (
    cursor: string | undefined,
    pageSize: number,
  ) => Promise<PaginatedResult<T>>;
}

/**
 * Infinite scroll configuration (discriminated union)
 */
export type InfiniteScrollConfig<T> =
  | PageBasedConfig<T>
  | CursorBasedConfig<T>;
