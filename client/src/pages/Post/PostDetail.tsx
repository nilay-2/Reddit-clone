import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostElement from "../../Components/Post";
import { RootState, AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostById,
  removeSelectedPost,
} from "../../app/reducers/postsReducer";
import { reset } from "../../app/reducers/commentsReducer";
import TextareaAutosize from "react-textarea-autosize";
import { createComment } from "../../app/reducers/commentsReducer";
import CommentsContainer from "../../Components/CommentsContainer";
import InputBox from "../../Components/InputBox";
const PostDetail: React.FC = () => {
  const { postId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (postId) dispatch(getPostById(postId));
  }, []);
  const postState = useSelector((state: RootState) => state.posts);

  const authState = useSelector((state: RootState) => state.auth);

  const [comment, setComment] = useState("");

  const textAreaOnChangeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = (e) => {
    setComment(e.target.value);
  };

  if (!postState.selectedPost) {
    return (
      <div className="text-white post-container max-w-4xl mx-auto">
        <button
          onClick={() => {
            if (postState.selectedPost) {
              dispatch(removeSelectedPost());
            }
            navigate("/");
          }}
        >
          <i className="bi bi-arrow-left-circle text-2xl"></i>
        </button>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 70px)" }} className="overflow-auto">
      <div className="text-white post-container max-w-4xl mx-auto flex flex-col gap-3 items-start py-5">
        <button
          onClick={() => {
            dispatch(removeSelectedPost());
            dispatch(reset());
            navigate(-1);
          }}
        >
          <i className="bi bi-arrow-left-circle text-2xl"></i>
        </button>
        <PostElement post={postState.selectedPost} />
        <InputBox typeOfMsg="comment" replyToCommentId={null} />
        <CommentsContainer postId={postState.selectedPost.id} />
      </div>
    </div>
  );
};

export default PostDetail;
