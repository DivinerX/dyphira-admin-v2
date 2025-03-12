import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
import { handleAsyncThunkError } from "@/utils/handleAsyncThunkError";

export const fetchSections = createAsyncThunk(
  "sections/fetchSections",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/sections");
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

export const fetchSectionQuestions = createAsyncThunk(
  "sections/fetchSectionQuestions",
  async (sectionId, thunkAPI) => {
    try {
      const response = await api.get(`/sections/${sectionId}/questions`);
      return { sectionId, questions: response.data };
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState: {
    sections: [],
    questions: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sections = action.payload;
      })
      .addCase(fetchSectionQuestions.fulfilled, (state, action) => {
        const { sectionId, questions } = action.payload;
        state.questions[sectionId] = questions;
      });
  },
});

export default sectionsSlice.reducer;
