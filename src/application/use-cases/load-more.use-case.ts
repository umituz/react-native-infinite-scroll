/**
 * Load More Use Case
 *
 * Application use case for loading more items
 * Follows SOLID, DRY, KISS principles
 * Single Responsibility: Handle load more operation
 */

import type { InfiniteScrollState } from "../../domain/types/infinite-scroll-state";
import { StateManagerService } from "../services/state-manager.service";
import { InfiniteScrollService } from "../services/infinite-scroll.service";

export class LoadMoreUseCase<T> {
  constructor(
    private stateManager: StateManagerService<T>,
    private infiniteScrollService: InfiniteScrollService<T>,
  ) {}

  /**
   * Execute load more operation
   */
  async execute(): Promise<void> {
    const state = this.stateManager.getState();

    // Guard clauses
    if (!state.hasMore || state.isLoadingMore || state.isLoading) {
      return;
    }

    // Set loading state
    this.stateManager.setLoadingMore(true);
    this.stateManager.setError(null);

    try {
      const nextPage = state.currentPage + 1;
      const data = await this.infiniteScrollService.loadPage(nextPage);
      const hasMore = this.infiniteScrollService.checkHasMore(data, [...state.pages, data]);

      this.stateManager.addPage(data, hasMore);
    } catch (error) {
      this.stateManager.setError(
        error instanceof Error ? error.message : "Failed to load more items"
      );
      this.stateManager.setLoadingMore(false);
    }
  }
}
