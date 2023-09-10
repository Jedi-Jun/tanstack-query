import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getPost } from './api/posts';
import PostsList1 from './components/PostsList1';
import PostsList2 from './components/PostsList2';
import PostDetail from './components/Post';
import CreatePost from './components/CreatePost';
import PostsPaginated from './components/PostsPaginated';
import PostsInfinite from './components/PostsInfinite';
import PostUseQueries from './components/PostUseQueries';
import FirstPost from './components/FirstPost';

const Home = () => {
  return <div>Select one of tabs above!</div>;
};

function App() {
  const [pageId, setPageId] = useState(null);
  const [currentPost, setCurrentPost] = useState(<Home />);

  const queryClient = useQueryClient();

  const onChangePost = Componet => {
    setPageId(null);
    setCurrentPost(<Componet setPageId={setPageId} />);
  };

  const onHoverButton = () => {
    console.log('mouse-enter');
    queryClient.prefetchQuery({
      queryKey: ['posts1', 1],
      queryFn: () => getPost(1),
      // staleTime: 1000 * 10,
    });
  };

  return (
    <div>
      <nav>
        <button onClick={() => onChangePost(Home)}>Home</button>
        <button onClick={() => onChangePost(PostsList1)}>Post List1</button>
        <button onClick={() => onChangePost(PostsList2)}>Post List2</button>
        <button onClick={() => onChangePost(CreatePost)}>New Post</button>
        <button onClick={() => onChangePost(PostsPaginated)}>Paginated</button>
        <button onClick={() => onChangePost(PostsInfinite)}>Infinite</button>
        <button onClick={() => onChangePost(PostUseQueries)}>Hook</button>
        <button
          onClick={() => onChangePost(FirstPost)}
          onMouseEnter={onHoverButton}
        >
          First Post
        </button>
      </nav>
      <hr />
      <article>{pageId ? <PostDetail pageId={pageId} /> : currentPost}</article>
    </div>
  );
}

export default App;
