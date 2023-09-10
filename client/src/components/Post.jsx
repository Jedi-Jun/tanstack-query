import { useQuery } from '@tanstack/react-query';
import { getPost } from '../api/posts';
import { getUser } from '../api/users';

export default function Post({ pageId }) {
  const postQuery = useQuery({
    queryKey: ['posts1', pageId],
    queryFn: () => getPost(pageId),
  });

  const userId = postQuery.data?.userId;
  const userQuery = useQuery({
    queryKey: ['users', userId],
    enabled: userId != null,
    queryFn: () => getUser(userId),
  });

  if (postQuery.status === 'loading') return <h2>Loading...</h2>;
  if (postQuery.status === 'error') return <h2>{postQuery.error}</h2>;

  return (
    <>
      <div>
        <h2>id: {postQuery.data.id}</h2>
        <h2>title: {postQuery.data.title}</h2>
        <p>desciption: {postQuery.data.body}</p>
      </div>
      {userQuery.status !== 'success' && !userId ? (
        'Error: userId not found!'
      ) : userQuery.status === 'loading' ? (
        <h3>Loading User...</h3>
      ) : userQuery.status === 'error' ? (
        <h3>Error Loading User</h3>
      ) : (
        <div>
          <h2>id: {userQuery.data.id}</h2>
          <h2>username: {userQuery.data.username}</h2>
          <p>email: {userQuery.data.email}</p>
        </div>
      )}
    </>
  );
}
