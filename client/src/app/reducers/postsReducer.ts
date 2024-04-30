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

export interface PostData {
  createdAt: number;
  authorId: number;
  title: string;
  textBody: string;
  htmlBody: string;
  username: string;
}

interface PostState {
  posts: Array<Post>;
  selectedPost: Post | null;
  isLoading: boolean;
  nextSetLoading: boolean;
  page: number;
  offset: number;
  terminateCall: boolean;
}

export interface Vote {
  userid: number;
  postid: number;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  isLoading: true,
  nextSetLoading: true,
  page: 0,
  offset: 0,
  terminateCall: false,
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
    nextPage: (state) => {
      state.page += 1;
      state.offset += 5;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      createPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        if (action.payload) {
          state.posts.unshift(action.payload);
        }
      }
    );

    builder.addCase(fetchPosts.pending, (state) => {
      if (state.page === 0) {
        state.isLoading = true;
      } else {
        state.nextSetLoading = true;
      }
    });
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Array<Post>>) => {
        if (!action.payload.length) {
          return {
            ...state,
            nextSetLoading: false,
            terminateCall: true,
          };
        }
        return {
          ...state,
          posts: [...state.posts, ...action.payload],
          isLoading: false,
          nextSetLoading: false,
        };
      }
    );
    builder.addCase(
      getPostById.fulfilled,
      (state, action: PayloadAction<Post>) => {
        console.log(action);
        return {
          ...state,
          selectedPost: action.payload,
        };
      }
    );
  },
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData: PostData) => {
    try {
      const res = await fetch(`${getFetchUrl()}/api/posts/createpost`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
        },
        body: JSON.stringify(postData),
      });

      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
      } else {
        toast.success(jsonRes.message, toastOpts);
        const post: Post = { ...jsonRes.data, username: postData.username };
        return post;
      }
      return jsonRes.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page, offset }: { page: number; offset: number }) => {
    try {
      const res = await fetch(
        `${getFetchUrl()}/api/posts?page=${page}&offset=${offset}`,
        {
          method: "GET",
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
      return initialState;
    }
  }
);

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
  nextPage,
} = postsReducer.actions;

export default postsReducer.reducer;
