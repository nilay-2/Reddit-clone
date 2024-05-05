import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Post } from "./postsReducer";
import {
  getFetchUrl,
  getAccessControlAllowOriginUrl,
} from "../../utils/appUrl";
interface SearchState {
  query: string;
  data: Array<Post>;
  page: number;
  offset: number;
  isLoading: boolean;
}

const initialState: SearchState = {
  query: "",
  data: [],
  page: 0,
  offset: 0,
  isLoading: false,
};

const searchReducer = createSlice({
  name: "search",
  initialState: initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fullTextSearch.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fullTextSearch.fulfilled,
      (state, action: PayloadAction<Array<Post>>) => {
        console.log(action.payload);
        state.isLoading = false;
        state.data = action.payload;
      }
    );
  },
});

export const fullTextSearch = createAsyncThunk(
  "search/fullTextSearch",
  async (query: string) => {
    const res = await fetch(
      `${getFetchUrl()}/api/posts/search?query=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
        },
      }
    );
    const jsonRes = await res.json();
    return jsonRes.data;
  }
);

export const { setSearchQuery } = searchReducer.actions;

export default searchReducer.reducer;
