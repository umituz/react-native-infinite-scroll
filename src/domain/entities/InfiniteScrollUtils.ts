/**
 * Infinite Scroll Utilities
 *
 * Pure functions for infinite scroll calculations
 * Follows SOLID, DRY, KISS principles
 */

/**
 * Calculate onEndReachedThreshold from threshold value
 * Converts threshold (number of items) to percentage (0-1)
 *
 * @param threshold - Number of items from bottom to trigger load
 * @param defaultThreshold - Default threshold if not provided (default: 0.1 = 10%)
 * @returns Threshold value between 0.01 and 1.0
 */
export function calculateEndReachedThreshold(
  threshold?: number,
  defaultThreshold = 0.1,
): number {
  if (!threshold) {
    return defaultThreshold;
  }

  // Convert threshold to percentage (0-1 range)
  // Ensure minimum 0.01 (1%) and maximum 1.0 (100%)
  const calculated = threshold / 100;
  return Math.max(0.01, Math.min(1.0, calculated));
}

/**
 * Calculate pagination slice for client-side pagination
 *
 * @param items - All items to paginate
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of items per page
 * @returns Slice of items for the requested page
 */
export function getPageSlice<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const start = page * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
}

/**
 * Check if there are more items to load
 *
 * @param lastPage - Last fetched page
 * @param allPages - All fetched pages
 * @param pageSize - Page size
 * @returns True if there are more items to load
 */
export function hasMoreItems<T>(
  lastPage: T[],
  allPages: T[][],
  pageSize: number,
): boolean {
  // If last page has fewer items than pageSize, we've reached the end
  return lastPage.length >= pageSize;
}

