import { isAxiosError } from "axios";
export const handleAsyncThunkError = (error: any, { rejectWithValue }: any) => {
  // Handle network errors
  if (isAxiosError(error) && !error.response) {
    return rejectWithValue({
      message: "Network Error: No response received from the server",
    });
  }

  // Handle server errors
  if (isAxiosError(error) && error.response) {
    return rejectWithValue({
      message: error.response.data?.message || "Server error",
      status: error.response.status,
    });
  }

  // Handle client-side errors
  return rejectWithValue({
    message: error.message || "An unexpected error occurred.",
    status: error.response?.status || 500,
  });
};
