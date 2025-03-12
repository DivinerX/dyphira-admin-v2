import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
import { handleAsyncThunkError } from "@/utils/handleAsyncThunkError";

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

export const fetchAllRewards = createAsyncThunk(
  "users/fetchAllRewards",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/rewards/all");
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

export const fetchAllAssessments = createAsyncThunk(
  "users/fetchAllAssessments",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/assessments/all");
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

export const fetchUserAssessments = createAsyncThunk(
  "users/fetchUserAssessments",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`users/${userId}/assessments`);
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

const usersSlice = createSlice({
  name: "sections",
  initialState: {
    users: [],
    assessments: [],
    user: {},
    rewards: [],
    status: "idle",
    error: null,
  },
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
      .addCase(fetchAllRewards.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.rewards = action.payload;
      })
      .addCase(fetchAllRewards.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllRewards.pending, (state) => {
        state.status = "pending";
      });
    builder
      .addCase(fetchAllAssessments.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.assessments = action.payload;
      })
      .addCase(fetchAllAssessments.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllAssessments.pending, (state) => {
        state.status = "pending";
      });
  },
});

export default usersSlice.reducer;
