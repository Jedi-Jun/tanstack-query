import { useState } from 'react';
import PostsList1 from './components/PostsList1';
import PostsList2 from './components/PostsList2';
import PostDetail from './components/Post';
import CreatePost from './components/CreatePost';

function App() {
  const [pageId, setPageId] = useState(null);
  const [currentPost, setCurrentPost] = useState(<PostsList1 setPageId={setPageId} />);

  const onChangePost = (Componet) => {
    setPageId(null);
    setCurrentPost(<Componet setPageId={setPageId} />);
  };

  return (
    <div>
      <button onClick={() => onChangePost(PostsList1)}>Post List1</button>
      <button onClick={() => onChangePost(PostsList2)}>Post List2</button>
      <button onClick={() => onChangePost(CreatePost)}>New Post</button>
      <hr />
      <article>{pageId ? <PostDetail pageId={pageId} /> : currentPost}</article>
    </div>
  );
}

export default App;
