import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Credentials } from "../../pages/Home/Auth";
interface Auth {
  id: string;
  username: string;
  email: string;
  photo: string | null;
}

const initialState: Auth = {
  id: "",
  username: "",
  email: "",
  photo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(verify.fulfilled, (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.id = data.id;
        state.username = data.username;
        state.email = data.email;
        state.photo = data.photo;
      }
    });

    builder.addCase(login.fulfilled, (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.id = data.id;
        state.username = data.username;
        state.email = data.email;
        state.photo = data.photo;
      }
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.id = data.id;
        state.username = data.username;
        state.email = data.email;
        state.photo = data.photo;
      }
    });
  },
});

// async actions
export const verify = createAsyncThunk("auth/verify", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/verify", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonRes = await res.json();
    return jsonRes;
  } catch (error) {
    console.log(error);
  }
});

export const login = createAsyncThunk(
  "auth/login",
  async (cred: Credentials) => {
    console.log(cred);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(cred),
      });

      const jsonRes = await res.json();
      console.log(jsonRes);
      return jsonRes;
    } catch (error) {
      console.log(error);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (cred: Credentials) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(cred),
      });

      const jsonResponse = await res.json();

      return jsonResponse;
    } catch (error) {
      console.log(error);
    }
  }
);

export default authSlice.reducer;
