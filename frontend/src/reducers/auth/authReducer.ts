import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";

interface User {
  _id: string;
  email: string;
  name?: string;
  token: string;
  uploadCount: number;
  downloadCount: number;
}
export interface AuthState {
  loggedInUser: User | null;
  loading: boolean;
}
interface SignUpPayload {
  email: string;
  password: string;
}
interface SignInPayload {
  email: string;
  password: string;
}
interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

const initialState: AuthState = {
  loggedInUser: null,
  loading: false,
};

// sign up request to the backend
export const signUpUser = createAsyncThunk<
  void,
  SignUpPayload,
  { rejectValue: string }
>("auth/sign-up-user", async (payload) => {
  try {
    const { data } = await backendApi.post<AuthResponse>(
      "/api/v1/auth/sign-up",
      payload
    );
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.warning(data.message);
    }
  } catch (error: any) {
    toast.error(error);
  }
});

// sign in user
export const signInUser = createAsyncThunk<
  string | null,
  SignInPayload,
  { rejectValue: string }
>("auth/sign-in-user", async (payload, thunkApi) => {
  try {
    const { email, password } = payload;
    const { data } = await backendApi.post<AuthResponse>(
      "/api/v1/auth/sign-in",
      { email, password }
    );
    if (data.success && data.user?.token) {
      if (data.user) {
        toast.success(data.message);
        localStorage.setItem("token", data.user.token);
      }
      return data.user.token || null;
      // TODO ; nvaigating user to the profile
    } else {
      toast.warning(data.message);
      return thunkApi.rejectWithValue(data.message);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    toast.error(errorMessage);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signInUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
export const selectLoggedInUser = (state: RootState) => state.auth.loggedInUser;
export const selectLoading = (state: RootState) => state.auth.loading;
