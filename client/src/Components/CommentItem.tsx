import React, { useState } from "react";
import formatTimeAgo from "../utils/timeFormat";
import {
  Comment,
  deleteComment,
  getReplies,
} from "../app/reducers/commentsReducer";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "./InputBox";
import ReplyList from "./ReplyList";
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const postState = useSelector((state: RootState) => state.posts);
  const [openInput, setOpenInput] = useState(false);

  const deleteCommentHandler = async () => {
    if (!comment.id || !postState.selectedPost?.id) return;

    if (comment.userid !== authState.id) return;

    if (!comment.replyto) {
      dispatch(
        deleteComment({
          postId: postState.selectedPost?.id,
          replyTo: comment.replyto,
          commentId: comment.id,
        })
      );
    }
  };

  return (
    <div className="p-3 rounded-md bg-redditPost flex flex-col gap-2">
      <div>
        <div className="user-details flex gap-2 items-center">
          <i className="bi bi-person-circle text-xl"></i>
          <span className="font-bold">{comment.username}</span>
          <span className="text-xs text-stone-400">
            {comment.createdat && formatTimeAgo(comment.createdat)}
          </span>
        </div>
        <div className="content text-sm text-gray-300">{comment.content}</div>
      </div>
      <div className="btn-group flex gap-3 text-sm">
        <button
          onClick={() => {
            setOpenInput(!openInput);
          }}
        >
          <i className="bi bi-reply-fill"></i>
        </button>
        {comment.userid === authState.id && (
          <button onClick={deleteCommentHandler}>
            <i className="bi bi-trash3-fill text-red-700"></i>
          </button>
        )}
        <div className="flex gap-2 items-center bg-stone-800 rounded-full py-1 px-2">
          <button
            className="rounded-full"
            onClick={() => {
              if (comment.id) {
                dispatch(getReplies(comment.id));
              }
            }}
          >
            <i className="bi bi-chat-square hover:text-red-600"></i>
          </button>
          <span className="text-xs">{comment.replies}</span>
        </div>
      </div>
      <div className="reply-box">
        {openInput && comment.id && (
          <InputBox
            typeOfMsg="reply"
            replyToCommentId={comment.id}
            setOpenInput={setOpenInput}
          />
        )}
      </div>
      <div className="reply-container">
        <ReplyList comment={comment} />
      </div>
    </div>
  );
};

export default CommentItem;
