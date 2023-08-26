import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// const url = 'https://jsonplaceholder.typicode.com/users';
const POSTS = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
];

const setDelay = (title, ms) =>
  new Promise(resolve => {
    let i = 1;
    const intervalId = setInterval(() => {
      console.log(`${title} > ${i++} (Loading...)`);
    }, 1000);
    setTimeout(() => resolve(clearInterval(intervalId)), ms);
  });

/* /posts → ["posts"]
   /posts/1 → ["posts", posts.id]
   /posts?authorId=1 → ["posts", {authorId: 1}]
   /posts/2/comments → ["posts", posts.id, "comments"] */
function App() {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['posts'],
    // queryFn: () => fetch(url).then(res => res.json()),
    queryFn: () => setDelay('useQuery', 3000).then(() => POSTS),
  });

  const mutation = useMutation({
    mutationFn: ({ title }) =>
      setDelay('useMutation', 3000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title })
      ),
    onSuccess: () => {
      console.log('@onSuccess');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  console.log('@mut-isLoading', mutation.isLoading);
  console.log('@que-isLoading: ', isLoading);
  console.log('@que-isFetching: ', isFetching);
  console.log('@data: ', data);
  console.log(`$$$${Date.now()}$$$`);
  if (isLoading) return <div>Loading...</div>;
  if (isFetching) return <div>Fetching...</div>;
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      <h2>TanStack Query</h2>
      <ul>
        {POSTS.map(post => (
          <li key={post.id}>{`${post.id}. ${post.title}`}</li>
        ))}
      </ul>
      <button
        disabled={mutation.isLoading}
        onClick={() => mutation.mutate({ title: 'Do Laundry' })}
      >
        Go!
      </button>
    </div>
  );
}

export default App;
