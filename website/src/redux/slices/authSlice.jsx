import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/newsletter/admin/login/', credentials);
      
      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Login failed' }
      );
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      await api.post('/api/newsletter/admin/logout/', { refresh_token });
      
      // Clear tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];
      
      return {};
    } catch (error) {
      // Clear tokens anyway
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];
      
      return rejectWithValue(
        error.response?.data || { error: 'Logout failed' }
      );
    }
  }
);

export const fetchAdminProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/newsletter/admin/profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch profile' }
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/api/token/refresh/', {
        refresh: refresh_token
      });
      
      localStorage.setItem('access_token', response.data.access);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      return response.data;
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];
      
      return rejectWithValue(
        error.response?.data || { error: 'Token refresh failed' }
      );
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (token && refreshToken) {
        state.isAuthenticated = true;
        state.token = token;
        state.refreshToken = refreshToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error || action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.status = 'idle';
      })
      
      // Fetch profile
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      
      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.access;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const { clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;