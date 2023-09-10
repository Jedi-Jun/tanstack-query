import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { createPost } from '../api/posts';

export default function CreatePost() {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  const createPostMutation = useMutation({
    mutationFn: createPost,

    onMutate: variables => {
      console.log('@1: ', variables);
      return { hi: 'hello' }; // context
    },
    onSuccess: (data, variables, context) => {
      console.log('@2-1: ', data);
      console.log('@2-2: ', variables);
      console.log('@2-3: ', context);
    },
    onError: (error, variables, context) => {
      console.log('@3-1: ', error);
      console.log('@3-2: ', variables);
      console.log('@3-3: ', context);
    },
    onSettled: (data, error, variables, context) => {
      console.log('@4-1: ', data);
      console.log('@4-2: ', error);
      console.log('@4-3: ', variables);
      console.log('@4-4: ', context);
    },
  });

  const handleSubmit = event => {
    event.preventDefault();
    // const title = event.target.title.value;
    // const body = event.target.body.value;

    const title = titleRef.current.value;
    const body = bodyRef.current.value;
    if (!title || !body) return;

    createPostMutation.mutate({ title, body });

    titleRef.current.value = '';
    bodyRef.current.value = '';
  };

  // isError, isLoading, isSuccess, isIdle, isPaused
  console.log('@isError: ', createPostMutation.isError);
  console.log('@isLoading: ', createPostMutation.isLoading);
  console.log('@isSuccess: ', createPostMutation.isSuccess);
  console.log('@isIdle: ', createPostMutation.isIdle);
  console.log('@isPaused: ', createPostMutation.isPaused);

  return (
    <div>
      {createPostMutation.isError && (
        <div>{createPostMutation.error.message}</div>
      )}
      {createPostMutation.isSuccess && <div>Add New Post Successful!</div>}
      <h3>Create Post</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title</label>
          <input id='title' ref={titleRef} autoFocus />
        </div>
        <div>
          <label htmlFor='body'>Body</label>
          <input id='body' ref={bodyRef} />
        </div>
        <button type='submit' disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? 'Loading...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
