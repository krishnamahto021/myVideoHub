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

// fetch videos for the loggedin users
export const fetchVideosForUser = createAsyncThunk<
  IVideo[],
  FileFetchPayload,
  { rejectValue: String }
>("/video/fetch-user-videos", async (payload, thunkapi) => {
  try {
    const { configWithJwt } = payload;
    const { data } = await backendApi.get<FileResponse>(
      "/api/v1/aws/fetch-videos",
      configWithJwt
    );
    if (data.success) {
      return data.videos || [];
    }
    return thunkapi.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Somewthign went wrong";
    return thunkapi.rejectWithValue(errMessage);
  }
});

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

// downloading of a gvien video
export const downloadVideo = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string }
>("video/download", async (payload, thunkAPI) => {
  try {
    const { id } = payload;
    const state = thunkAPI.getState() as RootState;
    const queryParams = state.auth.loggedInUser
      ? `?userId=${encodeURIComponent(state.auth.loggedInUser._id)}`
      : "";
    const response = await backendApi.get(
      `/api/v1/download/file/${id}${queryParams}`,
      {
        responseType: "blob",
      }
    );
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/['"]/g, "")
      : "video.mp4";
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

// deelting a given vdieo

export const deleteVideo = createAsyncThunk<
  { id: string },
  { id: string; configWithJWT: ConfigWithJWT },
  { rejectValue: string }
>("ideo/delete", async ({ id, configWithJWT }, thunkApi) => {
  try {
    const { data } = await backendApi.delete<FileResponse>(
      `/api/v1/aws/delete-single/video/${id}`,
      configWithJWT
    );
    if (data.success) {
      return { id };
    }
    return thunkApi.rejectWithValue(data.message);
  } catch (error: any) {
    return thunkApi.rejectWithValue(error);
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
      })
      .addCase(fetchVideosForUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVideosForUser.fulfilled, (state, action) => {
        state.videos = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchVideosForUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos =
          state.videos?.filter((video) => video._id !== action.payload.id) ||
          null;
      });
  },
});

export const videoReducer = videoSlice.reducer;
export const selectPublicVideos = (state: RootState) =>
  state.video.publicVideos;
export const selectUserVideos = (state: RootState) => state.video.videos;
export const selectVideoLoading = (state: RootState) => state.video.isLoading;
