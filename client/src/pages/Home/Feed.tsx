import React from "react";
import PostElement from "../../Components/Post";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
const Feed: React.FC = () => {
  const postState = useSelector((state: RootState) => state.posts);

  if (postState.isLoading) return <>Loading...</>;

  if (!postState.isLoading && !postState.posts.length)
    return <>No posts yet!😕</>;

  return (
    <div className="grow md:px-2 px-1 pb-2 overflow-auto flex flex-col gap-4">
      {postState.posts.map((post, i) => {
        return <PostElement key={i} post={post} />;
      })}
    </div>
  );
};

export default Feed;
