import axios from 'axios';

const setDelay = (title = '', ms) =>
  new Promise((resolve) => {
    let i = 1;
    const intervalId = setInterval(() => {
      console.log(`${title} → ${i++}s (Fetching...)`);
    }, 1000);
    setTimeout(() => resolve(clearInterval(intervalId)), ms);
  });

const getPost = async (id) => {
  console.log('#getPost-fetch-start');
  await setDelay(`post${id}`, 2000);
  const { data } = await axios.get(`http://localhost:3000/posts/${id}`);
  return data;
};

const getPosts = async (queryKey) => {
  console.log('#getPosts-fetch-start');
  await setDelay(queryKey, 2000);
  const { data } = await axios.get(
    // 'http://localhost:3000/posts?_sort=title&_order=asc'
    'http://localhost:3000/posts',
    { params: { _sort: 'id', _order: 'asc' } }
  );
  return data;
};

const createPost = async ({ title, body }) => {
  console.log('#createPost-fetch-start');
  await setDelay('createPost', 5000);
  axios
    .post('http://localhost:3000/posts', { userId: null, title, body })
    .then(() => console.log('New Post has been created!'));
};

export { getPost, getPosts, createPost };
