import { useQuery } from '@tanstack/react-query';
import { getPosts, getPost } from '../api/posts';

export default function PostsList1({ setPageId }) {
  const postQuery = useQuery({
    queryKey: ['posts1'],
    queryFn: () => getPosts('posts1'),
    // refetchInterval: 2000,
    // staleTime: 1000 * 15,
    // initialData: [{ id: 1, title: 'Initial Data' }],
    // placeholderData: [{ id: 1, title: 'Initial Data' }],
  });

  // console.log('@isLoading1:', postQuery.isLoading);
  // console.log('@status1: ', postQuery.status);
  // console.log('@data1: ', postQuery.data);
  // console.log('@isFetching1:', postQuery.isFetching);

  // console.log(postQuery.status); // 'error', 'loading', 'success'
  // console.log(postQuery.fetchStatus); // 'fetching', 'idle', 'paused'

  if (postQuery.status === 'loading') return <h2>Loading...</h2>;
  if (postQuery.status === 'error') return <h2>{postQuery.error}</h2>;

  const onClickPost = event => {
    const id = event.currentTarget.dataset.id;
    setPageId(id);
  };

  return (
    <div>
      <h3>Post List 1</h3>
      <ol>
        {postQuery.data.map((post, index) => (
          <li key={index} data-id={post.id} onClick={onClickPost}>
            <span>{post.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
