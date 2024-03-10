import React, { useEffect } from "react";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllComments } from "../app/reducers/commentsReducer";
import CommentItem from "./CommentItem";
const CommentsContainer: React.FC<{ postId: number }> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const commentState = useSelector((state: RootState) => state.comments);

  useEffect(() => {
    dispatch(getAllComments(postId));
  }, []);

  if (commentState.isLoading && !commentState.comments.length)
    return <div className="w-full pt-2">Loading comments.....</div>;

  if (!commentState.isLoading && !commentState.comments.length)
    return (
      <div className="w-full pt-2">
        No comments yet <span className="text-3xl">🥱</span>
      </div>
    );

  return (
    <div className="w-full pt-2 flex flex-col gap-2">
      {commentState.comments.map((comment) => {
        return <CommentItem comment={comment} key={comment.id} />;
      })}
    </div>
  );
};

export default CommentsContainer;
