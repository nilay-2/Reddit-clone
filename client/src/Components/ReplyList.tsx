import React from "react";
import { Comment } from "../app/reducers/commentsReducer";
import CommentItem from "./CommentItem";
const ReplyList: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <div className="reply-container">
      {comment.replymsg?.map((reply, i) => {
        return (
          <div key={i} className="border-l border-l-slate-600">
            <CommentItem comment={reply} />
          </div>
        );
      })}
    </div>
  );
};

export default ReplyList;
