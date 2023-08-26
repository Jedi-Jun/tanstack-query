import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api/posts';

export default function PostsList2() {
  useEffect(() => {
    console.log('#post2-mount');
    return () => console.log('#post2-unmount');
  }, []);

  const postQuery = useQuery({
    queryKey: ['posts22'],
    queryFn: () => getPosts('posts2'),
    // refetchInterval: 2000,
  });

  console.log('@status2: ', postQuery.status);
  console.log('@data2: ', postQuery.data);
  console.log('@isLoading2:', postQuery.isLoading);
  console.log('@isFetching2:', postQuery.isFetching);

  if (postQuery.status === 'error') return <h2>{postQuery.error}</h2>;
  if (postQuery.status === 'loading') return <h2>Loading...</h2>;

  return (
    <div>
      <h3>Post List 2</h3>
      <ol>
        {postQuery.data.map((post, index) => (
          <li key={index}>{post.title}</li>
        ))}
      </ol>
    </div>
  );
}
