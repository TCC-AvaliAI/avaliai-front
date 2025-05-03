import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const session = await getSession();
        if (!session?.refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await api.post("/user/refresh-token/", {
          refresh_token: session.refreshToken,
        });
        
        const { access_token, refresh_token } = response.data;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.sessionStorage.clear();
          await signOut({
            redirect: true,
            redirectTo: "/login"
          });
          return Promise.reject(new Error('Session expired'));
        }
      }
    }
    
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.sessionStorage.clear();
        await signOut({
          redirect: true,
          redirectTo: "/login"
        });
        return Promise.reject(new Error('Access forbidden'));
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
