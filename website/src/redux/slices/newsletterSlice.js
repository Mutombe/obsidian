// src/store/slices/newsletterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const subscribeToNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/newsletter/subscribe/', subscriptionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to subscribe' }
      );
    }
  }
);

export const unsubscribeFromNewsletter = createAsyncThunk(
  'newsletter/unsubscribe',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/newsletter/unsubscribe/', { token });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to unsubscribe' }
      );
    }
  }
);

export const fetchNewsletterPreferences = createAsyncThunk(
  'newsletter/fetchPreferences',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/newsletter/preferences/${token}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch preferences' }
      );
    }
  }
);

export const updateNewsletterPreferences = createAsyncThunk(
  'newsletter/updatePreferences',
  async ({ token, preferences }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/newsletter/preferences/${token}/`, { preferences });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to update preferences' }
      );
    }
  }
);

export const fetchSportCategories = createAsyncThunk(
  'newsletter/fetchSportCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/newsletter/sports/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch sports' }
      );
    }
  }
);

export const fetchLatestNewsletter = createAsyncThunk(
  'newsletter/fetchLatest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/newsletter/latest/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch newsletter' }
      );
    }
  }
);

export const fetchSportsNews = createAsyncThunk(
  'newsletter/fetchSportsNews',
  async ({ sport = null, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (sport) params.append('sport', sport);
      if (limit) params.append('limit', limit.toString());
      
      const response = await api.get(`/api/newsletter/news/?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch news' }
      );
    }
  }
);

export const fetchUpcomingFixtures = createAsyncThunk(
  'newsletter/fetchFixtures',
  async ({ sport = null, days = 14 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (sport) params.append('sport', sport);
      if (days) params.append('days', days.toString());
      
      const response = await api.get(`/api/newsletter/fixtures/?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: 'Failed to fetch fixtures' }
      );
    }
  }
);

const initialState = {
  // Subscription state
  subscriptionStatus: 'idle', // idle, loading, succeeded, failed
  subscriptionError: null,
  subscriptionMessage: null,
  isSubscribed: false,
  
  // Preferences state
  preferencesStatus: 'idle',
  preferencesError: null,
  preferences: null,
  subscriber: null,
  
  // Sports categories
  sportCategories: [],
  sportCategoriesStatus: 'idle',
  sportCategoriesError: null,
  
  // Newsletter content
  latestNewsletter: null,
  newsletterStatus: 'idle',
  newsletterError: null,
  
  // Sports news
  sportsNews: [],
  sportsNewsStatus: 'idle',
  sportsNewsError: null,
  
  // Fixtures
  upcomingFixtures: [],
  fixturesStatus: 'idle',
  fixturesError: null,
};

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    clearSubscriptionMessage: (state) => {
      state.subscriptionMessage = null;
      state.subscriptionError = null;
    },
    clearPreferencesError: (state) => {
      state.preferencesError = null;
    },
    resetSubscriptionStatus: (state) => {
      state.subscriptionStatus = 'idle';
      state.isSubscribed = false;
      state.subscriptionMessage = null;
      state.subscriptionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Subscribe to newsletter
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.subscriptionStatus = 'loading';
        state.subscriptionError = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.subscriptionStatus = 'succeeded';
        state.isSubscribed = true;
        state.subscriptionMessage = action.payload.message;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.subscriptionStatus = 'failed';
        state.subscriptionError = action.payload.error || action.payload;
        state.isSubscribed = false;
      })
      
      // Unsubscribe from newsletter
      .addCase(unsubscribeFromNewsletter.pending, (state) => {
        state.subscriptionStatus = 'loading';
        state.subscriptionError = null;
      })
      .addCase(unsubscribeFromNewsletter.fulfilled, (state, action) => {
        state.subscriptionStatus = 'succeeded';
        state.isSubscribed = false;
        state.subscriptionMessage = action.payload.message;
      })
      .addCase(unsubscribeFromNewsletter.rejected, (state, action) => {
        state.subscriptionStatus = 'failed';
        state.subscriptionError = action.payload.error || action.payload;
      })
      
      // Fetch preferences
      .addCase(fetchNewsletterPreferences.pending, (state) => {
        state.preferencesStatus = 'loading';
        state.preferencesError = null;
      })
      .addCase(fetchNewsletterPreferences.fulfilled, (state, action) => {
        state.preferencesStatus = 'succeeded';
        state.subscriber = action.payload.subscriber;
        state.preferences = action.payload.subscriber.preferences;
        state.sportCategories = action.payload.available_sports || [];
      })
      .addCase(fetchNewsletterPreferences.rejected, (state, action) => {
        state.preferencesStatus = 'failed';
        state.preferencesError = action.payload.error || action.payload;
      })
      
      // Update preferences
      .addCase(updateNewsletterPreferences.pending, (state) => {
        state.preferencesStatus = 'loading';
        state.preferencesError = null;
      })
      .addCase(updateNewsletterPreferences.fulfilled, (state, action) => {
        state.preferencesStatus = 'succeeded';
        state.subscriptionMessage = action.payload.message;
      })
      .addCase(updateNewsletterPreferences.rejected, (state, action) => {
        state.preferencesStatus = 'failed';
        state.preferencesError = action.payload.error || action.payload;
      })
      
      // Fetch sport categories
      .addCase(fetchSportCategories.pending, (state) => {
        state.sportCategoriesStatus = 'loading';
      })
      .addCase(fetchSportCategories.fulfilled, (state, action) => {
        state.sportCategoriesStatus = 'succeeded';
        state.sportCategories = action.payload;
      })
      .addCase(fetchSportCategories.rejected, (state, action) => {
        state.sportCategoriesStatus = 'failed';
        state.sportCategoriesError = action.payload.error || action.payload;
      })
      
      // Fetch latest newsletter
      .addCase(fetchLatestNewsletter.pending, (state) => {
        state.newsletterStatus = 'loading';
      })
      .addCase(fetchLatestNewsletter.fulfilled, (state, action) => {
        state.newsletterStatus = 'succeeded';
        state.latestNewsletter = action.payload;
      })
      .addCase(fetchLatestNewsletter.rejected, (state, action) => {
        state.newsletterStatus = 'failed';
        state.newsletterError = action.payload.error || action.payload;
      })
      
      // Fetch sports news
      .addCase(fetchSportsNews.pending, (state) => {
        state.sportsNewsStatus = 'loading';
      })
      .addCase(fetchSportsNews.fulfilled, (state, action) => {
        state.sportsNewsStatus = 'succeeded';
        state.sportsNews = action.payload.articles;
      })
      .addCase(fetchSportsNews.rejected, (state, action) => {
        state.sportsNewsStatus = 'failed';
        state.sportsNewsError = action.payload.error || action.payload;
      })
      
      // Fetch fixtures
      .addCase(fetchUpcomingFixtures.pending, (state) => {
        state.fixturesStatus = 'loading';
      })
      .addCase(fetchUpcomingFixtures.fulfilled, (state, action) => {
        state.fixturesStatus = 'succeeded';
        state.upcomingFixtures = action.payload.fixtures;
      })
      .addCase(fetchUpcomingFixtures.rejected, (state, action) => {
        state.fixturesStatus = 'failed';
        state.fixturesError = action.payload.error || action.payload;
      });
  },
});

export const { 
  clearSubscriptionMessage, 
  clearPreferencesError, 
  resetSubscriptionStatus 
} = newsletterSlice.actions;

export default newsletterSlice.reducer;

// Selectors
export const selectSubscriptionStatus = (state) => state.newsletter.subscriptionStatus;
export const selectIsSubscribed = (state) => state.newsletter.isSubscribed;
export const selectSubscriptionMessage = (state) => state.newsletter.subscriptionMessage;
export const selectSubscriptionError = (state) => state.newsletter.subscriptionError;
export const selectPreferences = (state) => state.newsletter.preferences;
export const selectSportCategories = (state) => state.newsletter.sportCategories;
export const selectLatestNewsletter = (state) => state.newsletter.latestNewsletter;
export const selectSportsNews = (state) => state.newsletter.sportsNews;
export const selectUpcomingFixtures = (state) => state.newsletter.upcomingFixtures;