import { useQuery } from '@tanstack/react-query';
import { getPost } from '../api/posts';
import { getUser } from '../api/users';

export default function Post({ pageId }) {
  const postQuery = useQuery({
    queryKey: ['posts', pageId],
    queryFn: () => getPost(pageId),
  });

  const userQuery = useQuery({
    queryKey: ['users', postQuery?.data?.userId],
    // enabled: postQuery.fetchStatus === 'idle',
    enabled: postQuery?.data?.userId != null,
    queryFn: () => getUser(postQuery?.data?.userId),
  });

  if (postQuery.status === 'error') return <h2>{postQuery.error}</h2>;
  if (postQuery.status === 'loading') return <h2>Loading...</h2>;

  return (
    <>
      <div>
        <h2>id: {postQuery.data.id}</h2>
        <h2>title: {postQuery.data.title}</h2>
        <p>desciption: {postQuery.data.body}</p>
      </div>
      {userQuery.status === 'loading' ? (
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
