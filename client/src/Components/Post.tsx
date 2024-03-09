import React, { useRef, useState, useEffect } from "react";
import { Post, upvote, vote } from "../app/reducers/postsReducer";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import "../css/style.css";
import { isPostLiked } from "../utils/isPostLiked";
import { useNavigate } from "react-router-dom";
// import * as DOMPurify from "dompurify";
// const sanitizeHTMLBody = () => ({
//   __html: DOMPurify.sanitize(post.htmlbody),
// });

const PostElement: React.FC<{
  post: Post;
  overview?: boolean;
}> = ({ post, overview = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  // ref to check if the div overflows with content
  const textOverflowRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

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

  const voteHandler = () => {
    const voteObj = {
      userid: authState.id,
      isupvote: true,
      postid: post.id,
    };

    dispatch(upvote(voteObj));
    dispatch(vote(voteObj));
  };

  const IsLiked: React.FC = () => {
    if (!isPostLiked(post.votes, authState.id))
      return (
        <i className="bi bi-hand-thumbs-up hover:text-red-600 cursor-pointer text-slate-300"></i>
      );
    else return <i className="bi bi-hand-thumbs-up-fill"></i>;
  };

  return (
    <div
      className={`w-full max-w-4xl h-auto rounded-lg mx-auto bg-redditPost ${
        overview
          ? "hover:bg-reddit  hover:border hover:border-opacity-5 hover:border-stone-500 cursor-pointer"
          : ""
      }  flex `}
    >
      <div
        className="votes w-16 rounded-s-lg md:flex hidden flex-col items-center pt-4"
        style={{ backgroundColor: "#151515" }}
      >
        <div className="btn-vote-group flex flex-col gap-4 text-center px-2 py-3 rounded-lg hover:bg-reddit bg-redditPost">
          <div>
            <div className="text-sm">{post.upvotes}</div>
            <button onClick={voteHandler}>
              <IsLiked />
            </button>
          </div>
          {/* <hr /> */}
          {/* <div>
            <div className="text-sm">{post.downvotes}</div>
            <button>
              <i className="bi bi-hand-thumbs-down hover:text-red-600 cursor-pointer text-slate-300"></i>
            </button>
          </div> */}
        </div>
      </div>
      <div
        className="posts-content w-full md:p-4 p-2"
        onClick={() => {
          if (overview) {
            navigate(`posts/${post.id}`);
          }
        }}
      >
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
          style={{ maxHeight: `${overview ? "400px" : "100%"}` }}
          ref={textOverflowRef}
        >
          {overview && <Overlap />}
          <p className="title mt-2 text-xl font-semibold">{post.title}</p>
          <div
            className="content mt-2 text-base text-slate-300 tiptap"
            dangerouslySetInnerHTML={{ __html: post.htmlbody }}
          ></div>
        </div>
        <div className="btn-group flex gap-4 mt-6 items-center">
          <div className="vote-grp flex gap-1 bg-stone-800 rounded-full px-2 md:hidden">
            <div className="flex gap-1 items-center p-2">
              <button className="rounded-full" onClick={voteHandler}>
                <IsLiked />
              </button>
              <span className="text-xs">{post.upvotes}</span>
            </div>
            {/* <div className="flex gap-1 items-center p-2">
              <button className="rounded-full">
              <i className="bi bi-hand-thumbs-down hover:text-red-600"></i>
              </button>
              <span className="text-xs">{post.downvotes}</span>
            </div> */}
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
