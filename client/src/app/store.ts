import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import postsReducer from "./reducers/postsReducer";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
