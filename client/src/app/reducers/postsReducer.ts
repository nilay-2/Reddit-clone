import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toastOpts } from "./authReducer";
import {
  getFetchUrl,
  getAccessControlAllowOriginUrl,
} from "../../utils/appUrl";
export interface Post {
  id: number;
  createdAt: number;
  authorId: number;
  title: string;
  htmlbody: string;
  textbody: string;
  comments: number;
  upvotes: number;
  downvotes: number;
  votes: Array<number>;
  username?: string;
}

interface PostState {
  posts: Array<Post>;
  isLoading: boolean;
}

export interface Vote {
  userid: number;
  postid: number;
  isupvote: boolean;
}

const initialState: PostState = {
  posts: [],
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
        updatePost.votes = removeFromLikedArr;
        if (updatePost.upvotes) updatePost.upvotes = +updatePost.upvotes - 1;
      } else {
        updatePost.votes.push(userid);
        updatePost.upvotes = +updatePost.upvotes + 1;
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
    builder.addCase(vote.fulfilled, (state, action: PayloadAction<Post>) => {
      const { id, votes, upvotes } = action.payload;
      const currPost = state.posts.find((post) => {
        return (post.id = id);
      });
      if (currPost && currPost.votes) {
        currPost.votes = votes;
        currPost.upvotes = upvotes;
      }
    });
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
    return jsonRes.data;
  } catch (error) {
    console.log(error);
  }
});

export const { upvote } = postsReducer.actions;

export default postsReducer.reducer;
