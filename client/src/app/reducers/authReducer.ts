import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Credentials } from "../../pages/Home/Auth";
import { toast } from "react-toastify";
import {
  getFetchUrl,
  getAccessControlAllowOriginUrl,
} from "../../utils/appUrl";
export const toastOpts = {
  theme: "dark",
  autoClose: 3000,
};

interface Auth {
  id: number;
  username: string;
  email: string;
  photo: string | null;
  loading: boolean;
}

const initialState: Auth = {
  id: 0,
  username: "",
  email: "",
  photo: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(verify.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verify.fulfilled, (state, action: PayloadAction<Auth>) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    });

    builder.addCase(login.fulfilled, (state, action: PayloadAction<Auth>) => {
      return {
        ...state,
        ...action.payload,
      };
    });
    builder.addCase(signup.fulfilled, (state, action: PayloadAction<Auth>) => {
      return {
        ...state,
        ...action.payload,
      };
    });
  },
});

// async actions
export const verify = createAsyncThunk("auth/verify", async () => {
  try {
    const res = await fetch(`${getFetchUrl()}/api/auth/verify`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
      },
    });

    const jsonRes = await res.json();
    console.log(jsonRes);
    return jsonRes.data;
  } catch (error) {
    console.log(error);
    return initialState;
  }
});

export const login = createAsyncThunk(
  "auth/login",
  async (cred: Credentials) => {
    try {
      const res = await fetch(`${getFetchUrl()}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
        },
        credentials: "include",
        body: JSON.stringify(cred),
      });

      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
      } else {
        toast.success(jsonRes.message, toastOpts);
      }
      return jsonRes.data;
    } catch (error) {
      console.log(error);
      return initialState;
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (cred: Credentials) => {
    try {
      const res = await fetch(`${getFetchUrl()}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
        },
        credentials: "include",
        body: JSON.stringify(cred),
      });

      const jsonResponse = await res.json();
      if (jsonResponse.error) {
        toast.error(jsonResponse.message, toastOpts);
      } else {
        toast.success(jsonResponse.message, toastOpts);
      }
      return jsonResponse.data;
    } catch (error) {
      console.log(error);
      return initialState;
    }
  }
);

export default authSlice.reducer;
