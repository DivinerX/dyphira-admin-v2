import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
import { handleAsyncThunkError } from "@/utils/handleAsyncThunkError";

export const fetchAssessment = createAsyncThunk(
  "assessment/fetchAssessment",
  async (assessmentId: string, thunkAPI: any) => {
    try {
      const response = await api.get(`/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

export const fetchAssessmentVideo = createAsyncThunk(
  "assessment/fetchAssessmentVideo",
  async (filename, thunkAPI) => {
    try {
      return { url: filename };
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

const assessmentSlice = createSlice({
  name: "assessment",
  initialState: {
    assessments: null,
    answers: [],
    videoUrl: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessment.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAssessment.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.assessments = action.payload;
      })
      .addCase(fetchAssessment.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchAssessmentVideo.fulfilled, (state, action) => {
        state.videoUrl = action.payload.url;
      });
  },
});

export default assessmentSlice.reducer;
