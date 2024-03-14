import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { AppDispatch, RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { createComment, createReply } from "../app/reducers/commentsReducer";
const InputBox: React.FC<{
  typeOfMsg: string;
  replyToCommentId: number | null;
  setOpenInput?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ typeOfMsg, replyToCommentId = null, setOpenInput }) => {
  const [comment, setComment] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const postState = useSelector((state: RootState) => state.posts);
  const authState = useSelector((state: RootState) => state.auth);

  const textAreaOnChangeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = (e) => {
    setComment(e.target.value);
  };

  return (
    <div
      className={`comment-box w-full ${typeOfMsg === "reply" ? "text-sm" : ""}`}
    >
      <div className="p-2 flex w-full">
        <TextareaAutosize
          value={comment}
          minRows={1}
          className="w-full p-2 outline outline-stone-700 outline-1 rounded-md"
          style={{ backgroundColor: "#242425" }}
          placeholder="Add a reply"
          onChange={textAreaOnChangeHandler}
        />
      </div>
      <div className="flex justify-end">
        <div className="btn-group flex gap-2 px-5">
          <button
            className={`px-3 py-1 rounded-lg ${
              typeOfMsg === "reply" ? "" : "bg-red-600"
            } text-white hover:bg-red-500 active:bg-red-600`}
            onClick={() => {
              if (setOpenInput) {
                setComment("");
                setOpenInput(false);
              }
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
              if (postState.selectedPost) {
                if (typeOfMsg === "comment") {
                  dispatch(
                    createComment({
                      userid: authState.id,
                      postid: postState.selectedPost?.id,
                      content: comment,
                      replyto: replyToCommentId,
                      username: authState.username,
                    })
                  );
                } else if (replyToCommentId) {
                  dispatch(
                    createReply({
                      postid: postState.selectedPost.id,
                      content: comment,
                      replyto: replyToCommentId,
                      //   username: authState.username,
                    })
                  );
                }
                setComment("");
              }
            }}
          >
            {typeOfMsg === "comment" ? "Comment" : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
