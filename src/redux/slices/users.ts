import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
import { handleAsyncThunkError } from "@/utils/handleAsyncThunkError";
import { User, Assessment } from "@/types";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI: any) => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (userId: string, thunkAPI: any) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

export const fetchUserAssessments = createAsyncThunk(
  "users/fetchUserAssessments",
  async (userId: string, thunkAPI: any) => {
    try {
      const response = await api.get(`users/${userId}/assessments`);
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);


export const setScoreAssessment = createAsyncThunk(
  "users/setScoreAssessment",
  async ({ assessmentId, data }: { assessmentId: string; data: any }, thunkAPI) => {
    try {
      const response = await api.patch(`/assessments/score/${assessmentId}`, data);
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  }
);

export type TUserState = {
  users: User[];
  user: User | {};
  assessments: Assessment[];
  status: "idle" | "pending" | "fulfilled" | "failed";
  error: string | null;
};

const initialState: TUserState = {
  users: [],
  user: {},
  assessments: [],
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.user = action.payload;
    });
    builder
      .addCase(fetchUserAssessments.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUserAssessments.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.assessments = action.payload;
      })
      .addCase(fetchUserAssessments.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(setScoreAssessment.pending, (state) => {
        state.status = "pending";
      })
      .addCase(setScoreAssessment.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.assessments = state.assessments.map((assessment) =>
          assessment._id === action.payload._id ? action.payload : assessment
        );
      })
      .addCase(setScoreAssessment.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default usersSlice.reducer;
