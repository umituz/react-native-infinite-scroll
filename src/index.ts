/**
 * React Native Infinite Scroll
 *
 * Clean Architecture implementation of infinite scroll for React Native
 * Follows SOLID, DRY, KISS principles
 */

// Domain Layer
export type { InfiniteScrollConfig } from "./domain/types/infinite-scroll-config";
export type { InfiniteScrollState } from "./domain/types/infinite-scroll-state";
export type { UseInfiniteScrollReturn } from "./domain/types/infinite-scroll-return";
export type { InfiniteScrollListProps } from "./domain/interfaces/infinite-scroll-list-props";
export {
  calculateEndReachedThreshold,
  getPageSlice,
  hasMoreItems,
} from "./domain/utils/pagination-utils";

// Application Layer
export { InfiniteScrollService } from "./application/services/infinite-scroll.service";

// Infrastructure Layer
export type { StorageAdapter } from "./infrastructure/storage/local-storage.adapter";
export { LocalStorageAdapter } from "./infrastructure/storage/local-storage.adapter";

// Presentation Layer
export { useInfiniteScroll } from "./presentation/hooks/useInfiniteScroll";
export { InfiniteScrollList } from "./presentation/components/infinite-scroll-list";
export { Loading } from "./presentation/components/loading";
export { LoadingMore } from "./presentation/components/loading-more";
export { Empty } from "./presentation/components/empty";
export { Error } from "./presentation/components/error";
