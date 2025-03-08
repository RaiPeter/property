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
      state.user = { ...state.user, ...action.payload };
      if (state.user && state.user.accessToken) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
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
export const verifyAuth = () => async (dispatch,getState) => {
  console.log("Verifying authentication...");

  try {
    const { data } = await axiosInstance.post("/auth/verify-token");
    console.log("Verification successful:", data);
    const state = getState();
    const currentUser = state.auth.user || { accessToken: null, refreshToken: null, loggedInUser: {} };

    const updatedUser = {
      ...currentUser, // Preserve accessToken, refreshToken
      loggedInUser: {
        ...currentUser.loggedInUser, // Preserve existing loggedInUser data
        ...data.user,               // Merge verified user data (e.g., userId, email)
      },
    };
    dispatch(setUser(updatedUser));
  } catch (error) {
    console.error("Verification failed. Trying refresh:", error);
    if (!error.response || error.response.status !== 401) {
      // Handle non-401 errors (e.g., network issues)
      console.error("Non-401 error during verification:", error.message);
      // dispatch(logoutUser());
      // window.location.href = '/';
    }  }
};

// Logout user and clear session
export const logoutAndClearSession = () => async (dispatch) => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  }
  dispatch(logoutUser());
  // window.location.href = '/';
};
export default authSlice.reducer;
