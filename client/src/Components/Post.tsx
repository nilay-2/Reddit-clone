import React, { useRef, useState, useEffect } from "react";
import { Post } from "../app/reducers/postsReducer";
import * as DOMPurify from "dompurify";
import "../css/style.css";
const PostElement: React.FC<{ post: Post }> = ({ post }) => {
  const sanitizeHTMLBody = () => ({
    __html: DOMPurify.sanitize(post.htmlbody),
  });

  // ref to check if the div overflows with content
  const textOverflowRef = useRef<HTMLDivElement>(null);

  const Overlap: React.FC = () => {
    const [isOverflowing, setIsOverflowing] = useState<Boolean>(false);
    useEffect(() => {
      const checkOverflow = () => {
        if (textOverflowRef.current) {
          const isOverflowingVertically =
            textOverflowRef.current.scrollHeight >
            textOverflowRef.current.clientHeight;
          if (isOverflowingVertically) setIsOverflowing(true);
        }
      };

      checkOverflow();
    }, []);
    if (!isOverflowing) return <></>;
    return (
      <div className="overlap h-20 absolute left-0 bottom-0 right-0 bg-gradient-to-t from-[#141416cc] to-transparent"></div>
    );
  };

  return (
    <div className="w-full max-w-4xl h-auto rounded-lg mx-auto hover:bg-reddit bg-redditPost hover:border hover:border-opacity-5 hover:border-stone-500 flex">
      <div
        className="votes w-16 rounded-s-lg md:flex hidden flex-col items-center pt-4"
        style={{ backgroundColor: "#151515" }}
      >
        <div className="btn-vote-group flex flex-col gap-2 text-center">
          <i className="bi bi-hand-thumbs-up hover:text-red-600 cursor-pointer text-xl text-slate-300"></i>
          <div className="text-sm">{post.upvotes}</div>
          <i className="bi bi-hand-thumbs-down hover:text-red-600 cursor-pointer text-xl text-slate-300"></i>
        </div>
      </div>
      <div className="posts-content w-full md:p-4 p-2">
        <div className="post-author-details flex justify-between">
          <div className="flex gap-1 items-center text-slate-400 text-sm">
            <i className="bi bi-person-circle text-2xl mr-2"></i>
            <p>{`u/${post.username}`}</p>
          </div>

          <div className="h-fit max-h-4">
            <button className="px-4 py-1 rounded-md bg-blue-700 text-xs hover:bg-blue-500 active:bg-blue-700">
              Join
            </button>
          </div>
        </div>
        <div
          className="text-content overflow-hidden h-auto relative"
          style={{ maxHeight: "400px" }}
          ref={textOverflowRef}
        >
          <Overlap />
          <p className="title mt-2 text-xl font-semibold">{post.title}</p>
          <div
            className="content mt-2 text-base text-slate-300 tiptap"
            dangerouslySetInnerHTML={{ __html: post.htmlbody }}
          ></div>
        </div>
        <div className="btn-group flex gap-4 mt-6 items-center">
          <div className="vote-grp flex gap-1 bg-stone-800 rounded-full px-2 md:hidden">
            <div className="flex gap-1 items-center p-2">
              <button className="rounded-full">
                <i className="bi bi-hand-thumbs-up hover:text-red-600"></i>
              </button>
              <span className="text-xs">{post.upvotes}</span>
            </div>
            <div className="flex gap-1 items-center p-2">
              <button className="rounded-full">
                <i className="bi bi-hand-thumbs-down hover:text-red-600"></i>
              </button>
              <span className="text-xs">{post.downvotes}</span>
            </div>
          </div>
          <div className="flex gap-1 items-center p-2 bg-stone-800 rounded-full px-4">
            <button className="rounded-full">
              <i className="bi bi-chat-square hover:text-red-600"></i>
            </button>
            <span className="text-xs">{post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostElement;
