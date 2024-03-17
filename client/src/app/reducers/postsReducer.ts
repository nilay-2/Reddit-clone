import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toastOpts } from "./authReducer";
import {
  getFetchUrl,
  getAccessControlAllowOriginUrl,
} from "../../utils/appUrl";
export interface Post {
  id: number;
  createdat: number;
  authorid: number;
  title: string;
  htmlbody: string;
  textbody: string;
  comments: number;
  upvotes: number;
  votes: Array<number>;
  username?: string;
}

interface PostState {
  posts: Array<Post>;
  selectedPost: Post | null;
  isLoading: boolean;
}

export interface Vote {
  userid: number;
  postid: number;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  isLoading: true,
};

const postsReducer = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    upvote: (state, action: PayloadAction<Vote>) => {
      const { postid, userid } = action.payload;

      const indexOfCurrPost = state.posts.findIndex((post) => {
        return post.id === postid;
      });

      if (indexOfCurrPost === -1) return; // post is not present

      const updatePost = state.posts[indexOfCurrPost];

      const isPostLiked = updatePost.votes.find((voteId) => {
        return voteId === userid;
      });

      if (isPostLiked) {
        const removeFromLikedArr = updatePost.votes.filter((voteId) => {
          return voteId !== userid;
        });
        if (updatePost.upvotes) {
          updatePost.upvotes = +updatePost.upvotes - 1;
        }
        updatePost.votes = removeFromLikedArr;
        if (state.selectedPost) {
          state.selectedPost.upvotes = +state.selectedPost.upvotes - 1;
          state.selectedPost.votes = removeFromLikedArr;
        }
      } else {
        updatePost.upvotes = +updatePost.upvotes + 1;
        updatePost.votes.push(userid);
        if (state.selectedPost) {
          state.selectedPost.upvotes = +state.selectedPost.upvotes + 1;
          state.selectedPost.votes.push(userid);
        }
      }
    },
    removeSelectedPost: (state) => {
      return {
        ...state,
        selectedPost: null,
      };
    },
    decrementCommentCounter: (state, action: PayloadAction<number>) => {
      if (state.selectedPost) {
        state.selectedPost.comments -= +action.payload;
      }
    },
    incrementCommentCounter: (state) => {
      if (state.selectedPost) {
        state.selectedPost.comments = +state.selectedPost.comments + 1;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPosts.pending, (state) => {
      return {
        ...state,
        isLoading: true,
      };
    });
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Array<Post>>) => {
        return {
          ...state,
          posts: action.payload,
          isLoading: false,
        };
      }
    );
    builder.addCase(
      getPostById.fulfilled,
      (state, action: PayloadAction<Post>) => {
        return {
          ...state,
          selectedPost: action.payload,
        };
      }
    );
  },
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const res = await fetch(`${getFetchUrl()}/api/posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
      },
    });

    const jsonRes = await res.json();
    console.log(jsonRes);
    if (jsonRes.error) {
      toast.error(jsonRes.message, toastOpts);
    }
    return jsonRes.data;
  } catch (error) {
    console.log(error);
    return initialState;
  }
});

export const vote = createAsyncThunk("posts/vote", async (vote: Vote) => {
  try {
    const res = await fetch(`${getFetchUrl()}/api/posts/vote`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
      },
      body: JSON.stringify(vote),
    });
    const jsonRes = await res.json();
    if (jsonRes.error) {
      toast.error(jsonRes.message, toastOpts);
    }
    return jsonRes.data;
  } catch (error) {
    console.log(error);
  }
});

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (postId: string) => {
    try {
      const res = await fetch(`${getFetchUrl()}/api/posts/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
        },
      });
      const jsonRes = await res.json();
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
      }
      return jsonRes.data;
    } catch (error) {
      console.log(error);
      return initialState;
    }
  }
);

export const {
  upvote,
  removeSelectedPost,
  decrementCommentCounter,
  incrementCommentCounter,
} = postsReducer.actions;

export default postsReducer.reducer;
