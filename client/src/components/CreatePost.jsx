import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { createPost } from '../api/posts';

export default function CreatePost({ setPageId }) {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data, variables, context) => {
      console.log('@1-1: ', data);
      console.log('@1-2: ', variables);
      console.log('@1-3: ', context);
      queryClient.setQueryData(['posts1', data.id], data);
      queryClient.invalidateQueries({
        queryKey: ['posts1'],
        exact: true,
      });
      setPageId(data.id);
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
          <input
            id='title'
            ref={titleRef}
            disabled={createPostMutation.isLoading}
            autoFocus
          />
        </div>
        <div>
          <label htmlFor='body'>Body</label>
          <input
            id='body'
            ref={bodyRef}
            disabled={createPostMutation.isLoading}
          />
        </div>
        <button type='submit' disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? 'Loading...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
