import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { infinitePosts } from '../api/posts';

// fetchNextPage,
// fetchPreviousPage,
// hasNextPage,
// hasPreviousPage,
// isFetchingNextPage,
// isFetchingPreviousPage,
// getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
// getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,

export default function PostsInfinite() {
  const {
    status,
    error,
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    getNextPageParam: lastPage => lastPage.nextPage,
    queryFn: ({ pageParam = 1 }) => infinitePosts(pageParam),
  });

  useEffect(() => {
    // window.scrollTo({ top: document.body.clientHeight, behavior: 'smooth' });
  }, [isFetchingNextPage]);

  if (status === 'error') return <h2>{error}</h2>;
  if (status === 'loading') return <h2>Loading...</h2>;

  return (
    <div className='infinite'>
      <h3>Infinite Post List</h3>
      <ul>
        {data.pages?.map(({ posts }, index) => (
          <section key={index}>
            {posts.map(post => (
              <li key={post.id}>
                <span>
                  {post.id}. {post.username}
                </span>
              </li>
            ))}
          </section>
        ))}
      </ul>
      <footer>
        {hasNextPage && (
          <button onClick={fetchNextPage}>
            {isFetchingNextPage ? 'Loading...' : 'More'}
          </button>
        )}
      </footer>
    </div>
  );
}
