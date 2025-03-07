import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../interceptor/interceptor";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (state.user && state.user.accessToken) {
        state.isAuthenticated = true;
      }
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginUser, setUser, logoutUser } = authSlice.actions;

// Verify if the user is authenticated
export const verifyAuth = () => async (dispatch) => {
  console.log("Verifying authentication...");

  try {
    const { data } = await axiosInstance.post("/auth/verify-token");
    console.log("Verification successful:", data);
    
    // dispatch(loginUser({ user: data.user}));
  } catch (error) {
    console.error("Verification failed. Trying refresh:", error);
    // dispatch(refreshTokenAndRetry());
  }
};

// Logout user and clear session
export const logoutAndClearSession = () => async (dispatch) => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  }
  dispatch(logoutUser());
};
export default authSlice.reducer;
