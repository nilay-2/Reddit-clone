import React, { useRef, useEffect } from "react";
import PostElement from "../../Components/Post";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
const Feed: React.FC = () => {
  const postState = useSelector((state: RootState) => state.posts);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Restore scroll position when component mounts
    if (scrollRef.current) {
      const storedPosition = sessionStorage.getItem("scroll");
      // console.log(storedPosition);
      const parsedPosition = storedPosition ? parseInt(storedPosition, 10) : 0;
      scrollRef.current.scrollTop = parsedPosition;
    }
  }, []);

  if (postState.isLoading) return <>Loading...</>;

  if (!postState.isLoading && !postState.posts.length)
    return <>No posts yet!😕</>;

  return (
    <div
      className="grow md:px-2 px-1 pb-2 overflow-auto flex flex-col gap-4"
      ref={scrollRef}
      onScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollY = `${e.currentTarget.scrollTop}`;
        sessionStorage.setItem("scroll", scrollY);
      }}
    >
      {postState.posts.map((post, i) => {
        return <PostElement key={i} post={post} overview={true} />;
      })}
    </div>
  );
};

export default Feed;
