import React from "react";
import Post from "../../Components/Post";
const Feed: React.FC = () => {
  return (
    <div className="grow md:px-2 px-1 pb-2 overflow-auto flex flex-col gap-4">
      {[1, 2, 3, 2, 2].map((_, i) => {
        return <Post key={i} />;
      })}
    </div>
  );
};

export default Feed;
