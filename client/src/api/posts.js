import axios from 'axios';

const setDelay = (title = '', ms) =>
  new Promise(resolve => {
    let i = 1;
    const intervalId = setInterval(() => {
      console.log(`${title} → ${i++}s (Fetching...)`);
    }, 1000);
    setTimeout(() => resolve(clearInterval(intervalId)), ms);
  });

const getPost = async id => {
  console.log('#getPost-fetch-start');
  await setDelay(`post${id}`, 2000);
  const { data } = await axios.get(`http://localhost:3000/posts/${id}`);
  return data;
};

const getPosts = async queryKey => {
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
  await setDelay('createPost', 3000);
  return axios
    .post('http://localhost:3000/posts', {
      userId: null,
      title,
      body,
    })
    .then(({ data }) => data);
};

const paginatedPosts = async ({ _page, _limit }) => {
  console.log('#paginatedPosts-fetch-start');
  await setDelay('createPost', 1000);
  return axios
    .get('http://localhost:3000/newPosts', {
      params: { _page, _limit },
    })
    .then(res => {
      const total = res.headers['x-total-count'];
      const hasMore = _page * _limit < total;
      return { posts: res.data, hasMore };
    });
};

const infinitePosts = async (_page, _limit = 12) => {
  console.log('#infinitPosts-fetch-start');
  await setDelay('createPost', 1000);
  return axios
    .get('http://localhost:3000/newPosts', {
      params: { _page, _limit },
    })
    .then(res => {
      const total = res.headers['x-total-count'];
      const hasNext = _page * _limit < total;
      return {
        posts: res.data,
        nextPage: hasNext ? _page + 1 : undefined,
        previousPage: _page > 1 ? _page - 1 : undefined,
      };
    });
};

export { getPost, getPosts, createPost, paginatedPosts, infinitePosts };
