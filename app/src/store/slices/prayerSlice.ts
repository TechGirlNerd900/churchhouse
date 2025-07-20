import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrayerState, PrayerRequest, PrayerResponse } from '../../types/prayer';

const initialState: PrayerState = {
  requests: [],
  myRequests: [],
  responses: [],
  isLoading: false,
  error: null,
};

const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<PrayerRequest[]>) => {
      state.requests = action.payload;
    },
    setMyRequests: (state, action: PayloadAction<PrayerRequest[]>) => {
      state.myRequests = action.payload;
    },
    setResponses: (state, action: PayloadAction<PrayerResponse[]>) => {
      state.responses = action.payload;
    },
    addRequest: (state, action: PayloadAction<PrayerRequest>) => {
      state.requests.unshift(action.payload);
      if (action.payload.userId === 'current-user-id') { // This should be replaced with actual user ID
        state.myRequests.unshift(action.payload);
      }
    },
    updateRequest: (state, action: PayloadAction<{ requestId: string; updates: Partial<PrayerRequest> }>) => {
      const { requestId, updates } = action.payload;
      
      const requestIndex = state.requests.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        state.requests[requestIndex] = { ...state.requests[requestIndex], ...updates };
      }
      
      const myRequestIndex = state.myRequests.findIndex(r => r.id === requestId);
      if (myRequestIndex !== -1) {
        state.myRequests[myRequestIndex] = { ...state.myRequests[myRequestIndex], ...updates };
      }
    },
    addResponse: (state, action: PayloadAction<PrayerResponse>) => {
      state.responses.push(action.payload);
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(r => r.id !== action.payload);
      state.myRequests = state.myRequests.filter(r => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRequests,
  setMyRequests,
  setResponses,
  addRequest,
  updateRequest,
  addResponse,
  removeRequest,
  setLoading,
  setError,
  clearError,
} = prayerSlice.actions;

export default prayerSlice.reducer;