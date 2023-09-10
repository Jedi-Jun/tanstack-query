import { useQuery, useQueries } from '@tanstack/react-query';
import { getPosts, getPost } from '../api/posts';

// const postQueries = useQueries({
//   queries: [
//     { queryKey: ['post', 1], queryFn: () => getPost(1) },
//     { queryKey: ['post', 2], queryFn: () => getPost(2) },
//   ],
// });

const PostDetail = ({ data }) => {
  const postQueries = useQueries({
    queries: data.map(post => ({
      queryKey: ['post', `${post.id}`],
      queryFn: () => getPost(post.id),
    })),
  });

  /* if (postQueries.some(({ status }) => status === 'error'))
    return <h2>Errors occur</h2>;
  if (postQueries.some(({ status }) => status === 'loading'))
    return <h2>Loading...</h2>; */

  return postQueries.map((ele, index) => (
    <li key={index}>
      {ele.isLoading
        ? 'Loading...'
        : ele.isError
        ? ele.error.message
        : ele.data?.title}
    </li>
  ));
};

export default function PostUseQueries() {
  const postQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts('posts1'),
    // refetchInterval: 2000,
    // staleTime: 1000 * 5,
  });

  if (postQuery.status === 'error') return <h2>{postQuery.error}</h2>;
  if (postQuery.status === 'loading') return <h2>Loading...</h2>;

  return (
    <div>
      <h3>Post List 1</h3>
      <ol>
        <PostDetail data={postQuery.data} />
      </ol>
    </div>
  );
}
