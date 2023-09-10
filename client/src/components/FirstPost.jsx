import { useQuery } from '@tanstack/react-query';
import { getPost } from '../api/posts';

export default function FirstPost() {
  const firstPost = useQuery({
    queryKey: ['posts1', 1],
    queryFn: () => getPost(1),
    cacheTime: 0,
  });

  if (firstPost.status === 'loading') return <h2>Loading...</h2>;
  if (firstPost.status === 'error') return <h2>{firstPost.error}</h2>;

  return (
    <div>
      <h3>First Post</h3>
      <span>{`${firstPost.data.id}. ${firstPost.data.title}`}</span>
      <p>{firstPost.data.body}</p>
    </div>
  );
}
