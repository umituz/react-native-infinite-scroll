/**
 * @umituz/react-native-infinite-scroll - Public API
 *
 * Modern, reusable infinite scroll system for React Native
 * with automatic pagination, loading states, and FlatList integration.
 *
 * Features:
 * - Automatic pagination with configurable threshold
 * - Loading states (initial, loading more, refreshing)
 * - Error handling with retry
 * - Pull-to-refresh support
 * - Customizable components
 * - TypeScript support with generics
 * - Follows SOLID, DRY, KISS principles
 *
 * Usage:
 * ```tsx
 * import { InfiniteScrollList, useInfiniteScroll } from '@umituz/react-native-infinite-scroll';
 *
 * // Using component
 * <InfiniteScrollList
 *   config={{
 *     pageSize: 20,
 *     threshold: 5,
 *     fetchData: async (page, pageSize) => {
 *       const response = await api.getItems({ page, limit: pageSize });
 *       return response.data;
 *     },
 *   }}
 *   renderItem={(item) => <ItemCard item={item} />}
 * />
 *
 * // Using hook
 * const { items, loadMore, refresh, canLoadMore } = useInfiniteScroll({
 *   pageSize: 20,
 *   fetchData: async (page, pageSize) => {
 *     return await api.getItems({ page, limit: pageSize });
 *   },
 * });
 * ```
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type {
  InfiniteScrollConfig,
  InfiniteScrollState,
  UseInfiniteScrollReturn,
  InfiniteScrollListProps,
} from "./domain/entities/InfiniteScroll";

// =============================================================================
// DOMAIN LAYER - Utilities
// =============================================================================

export {
  calculateEndReachedThreshold,
  getPageSlice,
  hasMoreItems,
} from "./domain/entities/InfiniteScrollUtils";

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useInfiniteScroll } from "./presentation/hooks/useInfiniteScroll";

// =============================================================================
// PRESENTATION LAYER - Components
// =============================================================================

export { InfiniteScrollList } from "./presentation/components/InfiniteScrollList";

