import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ConfigWithJWT } from "../../types";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";
import { RootState } from "../store";

export interface IVideo {
  _id: string;
  path: string;
  title?: string;
  description?: string;
  uploadedBy: {
    email: string;
  };
  isPrivate: boolean;
  thumbnail: string;
}

export interface EditVideo {
  _id: string;
  path: File | string;
  title?: string;
  description?: string;
  uploadedBy: {
    email: string;
  };
  isPrivate: boolean | string;
  thumbnail: File | string;
}

export interface VideoState {
  videos: IVideo[] | null;
  publicVideos: IVideo[] | null;
  searchResults: IVideo[] | null;
  isLoading: boolean;
  editVideo: IVideo | null;
}

// payload types
interface FileFetchPayload {
  configWithJwt: ConfigWithJWT;
}

// handling single File
interface SingleFileResponse {
  success: boolean;
  message: string;
  video?: IVideo;
}

interface FileResponse {
  success: boolean;
  message: string;
  videos?: IVideo[];
}

const initialState: VideoState = {
  videos: [],
  publicVideos: [],
  searchResults: [],
  isLoading: false,
  editVideo: null,
};

// fetch vidoes for the public
export const fetchVideosForPublic = createAsyncThunk<
  IVideo[],
  void,
  { rejectValue: string }
>("/videos/fetch-public-videos", async (_, thunkAPI) => {
  try {
    const { data } = await backendApi.get<FileResponse>("/api/v1/fetch-videos");
    if (data.success) {
      return data.videos || [];
    }
    return thunkAPI.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    toast.error(errMessage);
    return thunkAPI.rejectWithValue(errMessage);
  }
});

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideosForPublic.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVideosForPublic.fulfilled, (state, action) => {
        state.publicVideos = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchVideosForPublic.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const videoReducer = videoSlice.reducer;
export const selectPublicVideos = (state: RootState) =>
  state.video.publicVideos;
export const selectVideoLoading = (state: RootState) => state.video.isLoading;
