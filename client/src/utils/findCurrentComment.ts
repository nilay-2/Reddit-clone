import { Comment } from "../app/reducers/commentsReducer";
export const findCommentById = (
  comments: Array<Comment>,
  targetId: number
): Comment | null => {
  for (const comment of comments) {
    if (comment.id === targetId) {
      return comment;
    }

    if (comment.replymsg && comment.replymsg.length > 0) {
      const nestedComment = findCommentById(comment.replymsg, targetId);
      if (nestedComment) {
        return nestedComment;
      }
    }
  }

  return null;
};
