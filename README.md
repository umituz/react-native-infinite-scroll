# @umituz/react-native-infinite-scroll

Modern, reusable infinite scroll system for React Native with automatic pagination, loading states, and FlatList integration.

## Features

- ✅ Automatic pagination with configurable threshold
- ✅ Loading states (initial, loading more, refreshing)
- ✅ Error handling with retry
- ✅ Pull-to-refresh support
- ✅ Customizable components
- ✅ TypeScript support with generics
- ✅ Follows SOLID, DRY, KISS principles
- ✅ Zero dependencies (only React Native)

## Installation

```bash
npm install @umituz/react-native-infinite-scroll
```

## Usage

### Using Component

```tsx
import { InfiniteScrollList } from '@umituz/react-native-infinite-scroll';

function GoalsList() {
  return (
    <InfiniteScrollList
      config={{
        pageSize: 20,
        threshold: 5, // Load more when 5 items from bottom
        fetchData: async (page, pageSize) => {
          const response = await api.getGoals({ page, limit: pageSize });
          return response.data;
        },
      }}
      renderItem={(goal) => <GoalCard goal={goal} />}
    />
  );
}
```

### Using Hook

```tsx
import { useInfiniteScroll } from '@umituz/react-native-infinite-scroll';

function GoalsList() {
  const { items, loadMore, refresh, canLoadMore, state } = useInfiniteScroll({
    pageSize: 20,
    threshold: 5,
    fetchData: async (page, pageSize) => {
      const response = await api.getGoals({ page, limit: pageSize });
      return response.data;
    },
  });

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <GoalCard goal={item} />}
      onEndReached={() => {
        if (canLoadMore) {
          loadMore();
        }
      }}
      onEndReachedThreshold={0.1}
      onRefresh={refresh}
      refreshing={state.isRefreshing}
    />
  );
}
```

## API

### InfiniteScrollConfig

```typescript
interface InfiniteScrollConfig<T> {
  pageSize?: number; // Default: 20
  threshold?: number; // Default: 5 (items from bottom to trigger load)
  autoLoad?: boolean; // Default: true
  initialPage?: number; // Default: 0
  totalItems?: number; // Optional, for progress tracking
  fetchData: (page: number, pageSize: number) => Promise<T[]>;
  hasMore?: (lastPage: T[], allPages: T[][]) => boolean;
  getItemKey?: (item: T, index: number) => string;
}
```

### useInfiniteScroll Return

```typescript
interface UseInfiniteScrollReturn<T> {
  items: T[];
  state: InfiniteScrollState<T>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
  canLoadMore: boolean;
}
```

## License

MIT

