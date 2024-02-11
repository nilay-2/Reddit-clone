import React from "react";
import Post from "../../Components/Post";
const Feed: React.FC = () => {
  return (
    <div className="md:border-l md:border-l-slate-800 grow md:p-2 overflow-auto">
      {[1, 2, 3, 2, 2].map((_, i) => {
        return <Post key={i} />;
      })}
    </div>
  );
};

export default Feed;
