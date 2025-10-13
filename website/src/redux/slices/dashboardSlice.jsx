// src/store/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchDashboardOverview = createAsyncThunk(
  'dashboard/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/newsletter/admin/dashboard/overview/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch overview' }
      );
    }
  }
);

export const fetchSubscriberAnalytics = createAsyncThunk(
  'dashboard/fetchSubscriberAnalytics',
  async (days = 30, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/newsletter/admin/subscriber-analytics/?days=${days}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch subscriber analytics' }
      );
    }
  }
);

export const fetchNewsletterAnalytics = createAsyncThunk(
  'dashboard/fetchNewsletterAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/newsletter/admin/newsletter-analytics/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch newsletter analytics' }
      );
    }
  }
);

export const fetchContentAnalytics = createAsyncThunk(
  'dashboard/fetchContentAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/newsletter/admin/content-analytics/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch content analytics' }
      );
    }
  }
);

const initialState = {
  overview: null,
  subscriberAnalytics: null,
  newsletterAnalytics: null,
  contentAnalytics: null,
  overviewStatus: 'idle',
  subscriberStatus: 'idle',
  newsletterStatus: 'idle',
  contentStatus: 'idle',
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    refreshData: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.overviewStatus = 'loading';
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.overviewStatus = 'succeeded';
        state.overview = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.overviewStatus = 'failed';
        state.error = action.payload.error || action.payload;
      })
      
      // Subscriber Analytics
      .addCase(fetchSubscriberAnalytics.pending, (state) => {
        state.subscriberStatus = 'loading';
      })
      .addCase(fetchSubscriberAnalytics.fulfilled, (state, action) => {
        state.subscriberStatus = 'succeeded';
        state.subscriberAnalytics = action.payload;
      })
      .addCase(fetchSubscriberAnalytics.rejected, (state, action) => {
        state.subscriberStatus = 'failed';
        state.error = action.payload.error || action.payload;
      })
      
      // Newsletter Analytics
      .addCase(fetchNewsletterAnalytics.pending, (state) => {
        state.newsletterStatus = 'loading';
      })
      .addCase(fetchNewsletterAnalytics.fulfilled, (state, action) => {
        state.newsletterStatus = 'succeeded';
        state.newsletterAnalytics = action.payload;
      })
      .addCase(fetchNewsletterAnalytics.rejected, (state, action) => {
        state.newsletterStatus = 'failed';
        state.error = action.payload.error || action.payload;
      })
      
      // Content Analytics
      .addCase(fetchContentAnalytics.pending, (state) => {
        state.contentStatus = 'loading';
      })
      .addCase(fetchContentAnalytics.fulfilled, (state, action) => {
        state.contentStatus = 'succeeded';
        state.contentAnalytics = action.payload;
      })
      .addCase(fetchContentAnalytics.rejected, (state, action) => {
        state.contentStatus = 'failed';
        state.error = action.payload.error || action.payload;
      });
  },
});

export const { clearError, refreshData } = dashboardSlice.actions;
export default dashboardSlice.reducer;