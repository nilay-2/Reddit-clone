import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toastOpts } from "./authReducer";
import { devBackendUrl, prodBackendUrl } from "../../utils/appUrl";
export interface Post {
  id: string;
  createdAt: string;
  authorId: string;
  title: string;
  htmlbody: string;
  textbody: string;
  comments: string;
  upvotes: string;
  downvotes: string;
  username?: string;
}

interface PostState {
  posts: Array<Post>;
  isLoading: boolean;
}

const initialState: PostState = {
  posts: [],
  isLoading: true,
};

const postsReducer = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {},
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
  },
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const url =
      process.env.NODE_ENV === "production" ? prodBackendUrl : devBackendUrl;
    const res = await fetch(`${url}/api/posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonRes = await res.json();
    console.log(jsonRes);
    if (jsonRes.error) {
      toast.error(jsonRes.message, toastOpts);
    }
    console.log(jsonRes);
    return jsonRes.data;
  } catch (error) {
    console.log(error);
    return initialState;
  }
});

export default postsReducer.reducer;
