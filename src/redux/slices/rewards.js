import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
import { handleAsyncThunkError } from "@/utils/handleAsyncThunkError";

export const fetchRewards = createAsyncThunk(
  "rewards/createAnswer",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/rewards");
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

export const fetchPaymentHistory = createAsyncThunk(
  "rewards/fetchPaymentHistory",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/rewards/payment-history");
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error, thunkAPI);
    }
  },
);

const rewardsSlice = createSlice({
  name: "rewards",
  initialState: {
    paymentHistory: [],
    claimableRewards: 0,
    totalRewardsEarned: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewards.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.answerStatus = "fulfilled";
        state.claimableRewards = action.payload.claimableRewards;
        state.totalRewardsEarned = action.payload.totalRewardsEarned;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload;
      });
  },
});

export default rewardsSlice.reducer;
