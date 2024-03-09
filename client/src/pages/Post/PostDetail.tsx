import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostElement from "../../Components/Post";
import { RootState, AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostById,
  removeSelectedPost,
} from "../../app/reducers/postsReducer";
import TextareaAutosize from "react-textarea-autosize";
import {
  getAccessControlAllowOriginUrl,
  getFetchUrl,
} from "../../utils/appUrl";

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

  const createComment = async () => {
    try {
      const res = await fetch(
        `${getFetchUrl()}/api/comments/post/${postId}/comment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
          },
          body: JSON.stringify({
            userid: authState.id,
            replyto: null,
            content: comment,
            createdat: Date.now(),
          }),
        }
      );
      const jsonRes = await res.json();
      console.log(jsonRes);
    } catch (error) {
      console.log(error);
    }
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
    <div className="text-white post-container max-w-4xl mx-auto flex flex-col gap-3 items-start py-5">
      <button
        onClick={() => {
          dispatch(removeSelectedPost());
          navigate("/");
        }}
      >
        <i className="bi bi-arrow-left-circle text-2xl"></i>
      </button>
      <PostElement post={postState.selectedPost} />
      <div className="comment-box w-full">
        <div className="p-2 flex w-full">
          <TextareaAutosize
            value={comment}
            minRows={1}
            className="w-full p-2 outline outline-stone-700 outline-1 rounded-md"
            style={{ backgroundColor: "#242425" }}
            placeholder="Add a comment"
            onChange={textAreaOnChangeHandler}
          />
        </div>
        <div className="flex justify-end">
          <div className="btn-group flex gap-2 px-5">
            <button
              className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 active:bg-red-600"
              onClick={() => {
                setComment("");
              }}
            >
              cancel
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-white ${
                comment ? "bg-blue-600" : "bg-blue-400"
              } hover:bg-blue-500 active:bg-blue-600`}
              disabled={comment ? false : true}
              onClick={() => {
                createComment();
              }}
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
