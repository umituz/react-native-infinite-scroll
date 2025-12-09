/**
 * Infinite Scroll Service
 *
 * Application service for infinite scroll operations
 * Follows SOLID, DRY, KISS principles
 * Single Responsibility: Business logic for infinite scroll operations
 */

import type { InfiniteScrollConfig } from "../../domain/types/infinite-scroll-config";
import { hasMoreItems } from "../../domain/utils/pagination-utils";

export class InfiniteScrollService<T> {
  private config: InfiniteScrollConfig<T>;

  constructor(config: InfiniteScrollConfig<T>) {
    this.config = config;
  }

  /**
   * Load data for a specific page
   */
  async loadPage(page: number): Promise<T[]> {
    try {
      return await this.config.fetchData(page, this.getPageSize());
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to load data"
      );
    }
  }

  /**
   * Check if there are more items to load
   */
  checkHasMore(lastPage: T[], allPages: T[][]): boolean {
    if (this.config.hasMore) {
      return this.config.hasMore(lastPage, allPages);
    }
    return hasMoreItems(lastPage, allPages, this.getPageSize());
  }

  /**
   * Get page size from config or default
   */
  getPageSize(): number {
    return this.config.pageSize ?? 20;
  }

  /**
   * Get initial page from config or default
   */
  getInitialPage(): number {
    return this.config.initialPage ?? 0;
  }

  /**
   * Get threshold from config or default
   */
  getThreshold(): number {
    return this.config.threshold ?? 5;
  }

  /**
   * Check if auto load is enabled
   */
  isAutoLoadEnabled(): boolean {
    return this.config.autoLoad !== false;
  }

  /**
   * Get item key or default
   */
  getItemKey(item: T, index: number): string {
    if (this.config.getItemKey) {
      return this.config.getItemKey(item, index);
    }
    return `item-${index}`;
  }
}
