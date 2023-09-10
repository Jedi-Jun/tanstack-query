import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { paginatedPosts } from '../api/posts';

export default function PostsPaginated() {
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

  if (status === 'error') return <h2>{error}</h2>;
  if (status === 'loading') return <h2>Loading...</h2>;

  return (
    <div className='paginate'>
      <h3>Paginated Post List (page: {page})</h3>
      {isPreviousData ? (
        <section>
          <span>Previous Data</span>
        </section>
      ) : (
        <section>
          <ul>
            {data?.posts?.map((post, index) => (
              <li key={index}>
                <span>
                  {post.id}. {post.username}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <footer>
        <button type='button' disabled={!(page - 1)} onClick={handlePrevPage}>
          ◀ prev
        </button>
        <button
          type='button'
          disabled={!data?.hasMore}
          onClick={handleNextPage}
        >
          next ▶
        </button>
      </footer>
    </div>
  );
}
