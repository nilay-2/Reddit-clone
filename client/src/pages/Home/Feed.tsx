import React, { useRef, useEffect } from "react";
import PostElement from "../../Components/Post";
import { RootState, AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, nextPage } from "../../app/reducers/postsReducer";
const Feed: React.FC = () => {
  const postState = useSelector((state: RootState) => state.posts);

  const dispatch = useDispatch<AppDispatch>();

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

  if (postState.posts.length === 0) return <>Loading...</>;

  if (!postState.isLoading && !postState.posts.length)
    return <>No posts yet!😕</>;

  return (
    <div
      className="grow md:px-2 px-1 pb-2 flex flex-col gap-4 overflow-auto"
      ref={scrollRef}
      onScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollY = `${e.currentTarget.scrollTop}`;
        sessionStorage.setItem("scroll", scrollY);
        const scrollTop = Math.round(scrollRef.current?.scrollTop!);
        const scrollHeight = Math.round(scrollRef.current?.scrollHeight!);
        const client = Math.round(scrollRef.current?.clientHeight!);

        if (scrollTop === scrollHeight - client && !postState.terminateCall) {
          // console.log("load the next set of data");
          dispatch(nextPage());
        }
      }}
    >
      {postState.posts.map((post, i) => {
        return <PostElement key={i} post={post} overview={true} />;
      })}
      {postState.nextSetLoading && <div className="p-2">Loading.....</div>}
    </div>
  );
};

export default Feed;
