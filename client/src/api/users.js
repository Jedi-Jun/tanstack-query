import axios from 'axios';

const setDelay = (title = '', ms) =>
  new Promise(resolve => {
    let i = 1;
    const intervalId = setInterval(() => {
      console.log(`${title} → ${i++}s (Fetching...)`);
    }, 1000);
    setTimeout(() => resolve(clearInterval(intervalId)), ms);
  });

const getUser = async id => {
  console.log('#getUser-fetch-start');
  await setDelay(`user${id}`, 2000);
  const { data } = await axios.get(`http://localhost:3000/users/${id}`, {
    timeout: 5000,
  });
  return data;
};

export { getUser };
