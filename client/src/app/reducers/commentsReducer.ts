import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toastOpts } from "./authReducer";
import {
  getFetchUrl,
  getAccessControlAllowOriginUrl,
} from "../../utils/appUrl";
import { findCommentById } from "../../utils/findCurrentComment";
import {
  decrementCommentCounter,
  incrementCommentCounter,
} from "./postsReducer";

export interface Comment {
  id?: number;
  postid: number;
  userid?: number;
  replyto: number | null;
  content: string;
  createdat?: number;
  replies?: number;
  username?: string;
  replymsg?: Array<Comment>;
}

interface CommentState {
  comments: Array<Comment>;
  isLoading: boolean;
}

const initialState: CommentState = {
  comments: [],
  isLoading: true,
};

const commentsReducer = createSlice({
  name: "comments",
  initialState: initialState,
  reducers: {
    reset: (state) => {
      return {
        ...state,
        comments: [],
        isLoading: true,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(
      createComment.fulfilled,
      (state, action: PayloadAction<Comment>) => {
        state.comments.push(action.payload);
      }
    );
    builder.addCase(
      getAllComments.fulfilled,
      (state, action: PayloadAction<Array<Comment>>) => {
        return {
          ...state,
          isLoading: false,
          comments: action.payload,
        };
      }
    );
    builder.addCase(
      deleteComment.fulfilled,
      (state, action: PayloadAction<Comment>) => {
        if (action.payload && action.payload.id) {
          const filteredComments = state.comments.filter((comment) => {
            return comment.id !== action.payload.id;
          });
          const parentComment = findCommentById(
            state.comments,
            action.payload.id
          );
          if (parentComment && parentComment.replies) {
            parentComment.replies = +parentComment.replies - 1;
          }
          return {
            ...state,
            comments: filteredComments,
          };
        }
      }
    );
    builder.addCase(
      createReply.fulfilled,
      (state, action: PayloadAction<Comment>) => {
        if (action.payload && action.payload.replyto) {
          const parentComment = findCommentById(
            state.comments,
            action.payload.replyto
          );
          console.log(parentComment);
          if (parentComment && parentComment.replies) {
            parentComment.replies = +parentComment.replies + 1;
            parentComment.replymsg?.push(action.payload);
          }
        }
      }
    );
    builder.addCase(
      getReplies.fulfilled,
      (state, action: PayloadAction<Array<Comment>>) => {
        if (
          action.payload &&
          action.payload.length > 0 &&
          action.payload[0].replyto
        ) {
          const parentComment = findCommentById(
            state.comments,
            action.payload[0].replyto
          );
          if (parentComment) {
            parentComment.replymsg = action.payload;
          }
        }
      }
    );
  },
});

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (commentObj: Comment, { dispatch }) => {
    try {
      const res = await fetch(
        `${getFetchUrl()}/api/comments/post/${commentObj.postid}/comment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
          },
          body: JSON.stringify({
            userid: commentObj.userid,
            replyto: commentObj.replyto,
            content: commentObj.content,
            createdat: Date.now(),
          }),
        }
      );
      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
      }
      dispatch(incrementCommentCounter());
      toast.success(jsonRes.message, toastOpts);
      return { ...jsonRes.data, username: commentObj.username };
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllComments = createAsyncThunk(
  "comments/getAllComments",
  async (postId: number) => {
    try {
      const res = await fetch(
        `${getFetchUrl()}/api/comments/post/${postId}/comment`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
          },
        }
      );

      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
      }
      return jsonRes.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (
    {
      postId,
      replyTo,
      commentId,
    }: {
      postId: number;
      replyTo: number | null;
      commentId: number;
    },
    { dispatch }
  ) => {
    try {
      const res = await fetch(
        `${getFetchUrl()}/api/comments/post/${postId}/comment/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
          },
          body: JSON.stringify({ replyTo }),
        }
      );
      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
        return jsonRes.data;
      }
      dispatch(decrementCommentCounter());
      toast.success(jsonRes.message, toastOpts);
      return jsonRes.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createReply = createAsyncThunk(
  "comments/createReply",
  async (replyToObj: Comment, { dispatch }) => {
    try {
      const res = await fetch(
        `${getFetchUrl()}/api/comments/post/${replyToObj.postid}/comment/${
          replyToObj.replyto
        }/reply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
          },
          body: JSON.stringify({
            content: replyToObj.content,
            createdAt: Date.now(),
          }),
        }
      );
      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
        return;
      }
      dispatch(incrementCommentCounter());
      toast.success(jsonRes.message, toastOpts);
      return jsonRes.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getReplies = createAsyncThunk(
  "comments/getReplies",
  async (commentId: number) => {
    try {
      const res = await fetch(
        `${getFetchUrl()}/api/comments/replies/${commentId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
          },
        }
      );
      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
        return;
      }
      return jsonRes.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const { reset } = commentsReducer.actions;

export default commentsReducer.reducer;
