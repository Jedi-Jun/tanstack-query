# TanStack Query Tutorial

- @tanstack/react-query
- @tanstack/react-query-devtools

### YT

https://youtu.be/r8Dg0KVnfMA

## Prepare

```js
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  // keep data fresh in 5 mins
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen />
  </QueryClientProvider>
);
```

## 1) Queries

```js
import { useQuery } from '@tanstack/react-query';

const todoQuery = useQuery({
  queryKey: ['todos'], // unique key
  queryFn: fetchTodoList,
  // enabled: userId != null,
  // refetchInterval: 2000,
  // staleTime: 1000 * 15,
});

/* todoQuery.loading / todoQuery.status
1) isLoading, (status === 'loading)' → query has no data yet
2) isError, (status === 'error') → query encountered an error
3) isSuccess, (status === 'success') → data is available */

/* todoQuery.fetchStatus
1) (fetchStatus === 'fetching') → query is currently fetching
2) (fetchStatus === 'paused') → query is paused
3) (fetchStatus === 'idle') → query is not doing anything */
```

### 1-1) `useQuery` twice

```js
const Post = ({ pageId }) => {
  const postQuery = useQuery({
    queryKey: ['posts', pageId],
    queryFn: () => getPost(pageId),
  });

  const userId = postQuery.data?.userId;

  const userQuery = useQuery({
    queryKey: ['users', userId],
    enabled: userId != null,
    queryFn: () => getUser(userId),
  });
};
```

## 2) Mutations

```js
const mutation = useMutation({
  mutationFn: createTodo,
  // onMutate: (variables) => {}
  // onSuccess: (data, variables, context) => {}
  // onError: (error, variables, context) => {}
  // onSettled: (data, error, variables, context) => {}
});

const createTodo = (newTodo) => axios.post('/todos', newTodo);
const addTodo = () => mutation.mutate({ title: 'newTodo' });

<buttom onClick={addTodo}>ADD</button>

/* mutation.loading / mutation.status
1) isIdle, (status === 'idle') → mutation is idle, fresh, reset state
2) isLoading, (status === 'loading') → mutation is running
3) isError, (status === 'error') → mutation encountered an error
4) isSuccess, (status === 'success') → mutation data is available */
```

### 2-1) `staleTime` & `invalidateQueries`

```js
// index.jsx
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  // keep fresh 5 mins first, and then stale
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

// CreatePost.jsx
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: (data, variables, context) => {
    // immediately invalidate a query started with `posts` queryKey
    queryClient.invalidateQueries({ queryKey: ['posts'], exact: true });
  },
});
```

### 2-2) `setQueryData`

- Update a query's cached data immediately

```js
// CreatePost.jsx
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: (data, variables, context) => {
    // immediately update a query's cached data
    queryClient.setQueryData(['posts', data.id], data);
  },
});
```

## 3) Paginated Queries (`prefetchQuery`)

```js
import { useQuery, useQueryClient } from '@tanstack/react-query';

const [page, setPage] = useState(1);
const queryClient = useQueryClient();

const { status, error, data, isPreviousData } = useQuery({
  queryKey: ['posts', { page }],
  queryFn: () => paginatedPosts({ _page: page, _limit: 5 }),
  keepPreviousData: true, // lagging previous fetched data
});

// prefetch is optional
useEffect(() => {
  if (!isPreviousData && data?.hasMore) {
    queryClient.prefetchQuery({
      queryKey: ['posts', { page: page + 1 }],
      queryFn: () => paginatedPosts({ _page: page + 1, _limit: 5 }),
    });
  }
}, [isPreviousData, data, page]);

const handlePrevPage = () => {
  setPage(prev => prev - 1);
};
const handleNextPage = () => {
  if (isPreviousData) return;
  setPage(prev => prev + 1);
};

// Server-side
const paginatedPosts = ({ _page, _limit }) => {
  return axios
    .get('http://localhost:3000/newPosts', {
      params: { _page, _limit },
    })
    .then(res => {
      const total = res.headers['x-total-count'];
      const hasMore = _page * _limit < total;
      return { posts: res.data, hasMore };
    });
};
```

## 4) InfiniteQuery

```js
const {
  // fetchPreviousPage,
  // hasPreviousPage,
  // isFetchingPreviousPage,
  status,
  error,
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
} = useInfiniteQuery({
  queryKey: ['posts', 'infinite'],
  getNextPageParam: lastPage => lastPage.nextPage,
  // getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
  queryFn: ({ pageParam = 1 }) => infinitePosts(pageParam),
});

<div>
  {hasNextPage && (
    <button onClick={fetchNextPage}>
      {isFetchingNextPage ? 'Loading...' : 'More'}
    </button>
  )}
</div>;

// Server-side
const infinitePosts = (_page, _limit = 12) => {
  return axios
    .get('http://localhost:3000/newPosts', {
      params: { _page, _limit },
    })
    .then(res => {
      const total = res.headers['x-total-count'];
      const hasNext = _page * _limit < total;
      return {
        posts: res.data,
        nextPage: hasNext ? _page + 1 : undefined,
        previousPage: _page > 1 ? _page - 1 : undefined,
      };
    });
};
```

## 5) `useQueries` Hook

```js
const results = useQueries({
  queries: [
    { queryKey: ['post', 1], queryFn: () => getPost(1) },
    { queryKey: ['post', 2], queryFn: () => getPost(2) },
  ],
});
```

## 6) Prefetching with `mouseenter`

```js
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const onHoverPostOne = () => {
  queryClient.prefetchQuery({
    queryKey: ['posts', 1],
    queryFn: () => getPost(1),
  });
};

<button onClick={setComponent(<FirstPost />)} onMouseEnter={onHoverPostOne} />;

// FirstPost.jsx
function FirstPost() {
  // No loading time due to prefetch in advance
  const firstPost = useQuery({
    queryKey: ['posts', 1],
    queryFn: () => getPost(1),
    cacheTime: 0,
  });
}
```

## 7) Initial & Placeholder

```js
const postQuery = useQuery({
  queryKey: ['posts'],
  queryFn: () => getPosts('posts'),
  // initialData: [{ id: 1, title: 'Initial Data' }],
  placeholderData: [{ id: 1, title: 'Initial Data' }],
});
```
