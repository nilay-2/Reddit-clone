import React from "react";
import formatTimeAgo from "../utils/timeFormat";
import { Comment } from "../app/reducers/commentsReducer";
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <div className="p-3 rounded-md bg-redditPost">
      <div className="user-details flex gap-2 items-center">
        <i className="bi bi-person-circle text-xl"></i>
        <span className="font-bold">{comment.username}</span>
        <span className="text-xs text-stone-400">
          {comment.createdat && formatTimeAgo(comment.createdat)}
        </span>
      </div>
      <div className="content text-sm text-gray-300">{comment.content}</div>
    </div>
  );
};

export default CommentItem;
