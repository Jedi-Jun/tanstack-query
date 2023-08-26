import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { createPost } from '../api/posts';

export default function CreatePost() {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  // https://youtu.be/r8Dg0KVnfMA?t=1747
  const createPostMutation = useMutation({
    mutationFn: createPost,

    onSuccess: (data, variables, context) => {
      console.log('@1: ', context);
    },
    onMutate: (variables) => {
      console.log('@2: ', variables);
      return { hi: 'hello' };
    },

    // onSuccess: (data, variables, context) => {}
    // onError: (error, variables, context) => {}
    // onSettled: (data, error, variables, context) => {}
    // onMutate: (variables) => {}
  });

  const handleSubmit = (event) => {
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
      {createPostMutation.isError && JSON.stringify(createPostMutation.error)}
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
