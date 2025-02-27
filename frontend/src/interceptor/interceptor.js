import axios from 'axios';
import { loginUser, logoutAndClearSession } from '../features/slices/authSlice';
import store from '../store';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
    withCredentials: true, 
})

axiosInstance.interceptors.request.use(
    (config) => {
        // const state = store.getState(); // Get Redux state
        // const token = state.auth.accessToken;
        // if (token) {
        //     config.headers['Authorization'] = `Bearer ${token}`;
        // }
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
                const { data } = await axiosInstance.post("/auth/refresh");
                console.log("Refresh Token Success:", data);

                if (data) {
                    store.dispatch(loginUser({ user: data.user }));
                }
                 
                return axiosInstance(originalRequest);
            } catch (error) {
                console.error('Refresh token expired. Logging out...');
                
                // Clear Redux state and logout user
                store.dispatch(logoutAndClearSession());
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;