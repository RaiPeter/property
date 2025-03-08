import axios from 'axios';
import { setUser, logoutAndClearSession } from '../features/slices/authSlice';
import store from '../store';

const getBaseUrl = () => {
    // Use environment variable to determine the base URL
    return import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Default for development
  };

const axiosInstance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 90000,
    withCredentials: true, 
})

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        console.log(state, "line");
         // Get Redux state
        const accessToken = state.auth.user?.accessToken || localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        console.log('Request Headers:', config.headers);
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if(error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // const refreshToken = Cookies.get('refreshToken');
                const state = store.getState();
                const refreshToken = state.auth.user?.refreshToken;
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                  }
                console.log('Sending Refresh Token:', refreshToken);
                const {data}  = await axiosInstance.post("/auth/refresh", { refreshToken });
                console.log("Refresh Token Success:", data);
                const currentUser = state.auth.user || { accessToken: null, refreshToken: null, loggedInUser: {} };
                const updatedUser = {
                  ...currentUser,
                    accessToken: data.accessToken,
                  };

                store.dispatch(setUser(updatedUser));
          
                  // Update localStorage as a fallback
                //   localStorage.setItem('accessToken', data.accessToken);
                //   localStorage.setItem('refreshToken', data.refreshToken);

                // if (data) {
                //     store.dispatch(loginUser({ user: data.user }));
                // }
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                console.log('Retrying request with new token:', originalRequest.headers.Authorization);
                return axiosInstance(originalRequest);
            } catch (error) {
                console.error('Refresh token expired. Logging out...',error);
                
                // Clear Redux state and logout user
                store.dispatch(logoutAndClearSession());
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;