import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PrayerState, PrayerRequest, CreatePrayerData, PrayerResponse } from '../../types/prayer';
import * as prayerService from '../../services/prayerService';

const initialState: PrayerState = {
  requests: [],
  myRequests: [],
  responses: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const createPrayerRequest = createAsyncThunk(
  'prayer/createRequest',
  async ({ 
    prayerData, 
    userId, 
    userName, 
    userProfilePic 
  }: { 
    prayerData: CreatePrayerData; 
    userId: string; 
    userName: string; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await prayerService.createPrayerRequest(prayerData, userId, userName, userProfilePic);
      if (result.success) {
        return result.id;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPrayerRequests = createAsyncThunk(
  'prayer/fetchRequests',
  async (filter?: { 
    category?: string; 
    audience?: string; 
    fellowshipId?: string;
    status?: string;
  }, { rejectWithValue }) => {
    try {
      const result = await prayerService.getPrayerRequests(filter);
      if (result.success) {
        return result.prayers;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyPrayers = createAsyncThunk(
  'prayer/fetchMyPrayers',
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await prayerService.getMyPrayers(userId);
      if (result.success) {
        return result.prayers;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const prayForRequest = createAsyncThunk(
  'prayer/prayForRequest',
  async ({ 
    prayerRequestId, 
    userId, 
    userName, 
    message, 
    isAnonymous, 
    userProfilePic 
  }: { 
    prayerRequestId: string; 
    userId: string; 
    userName: string; 
    message?: string; 
    isAnonymous?: boolean; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await prayerService.prayForRequest(
        prayerRequestId, 
        userId, 
        userName, 
        message, 
        isAnonymous, 
        userProfilePic
      );
      if (result.success) {
        return prayerRequestId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const supportPrayerRequest = createAsyncThunk(
  'prayer/supportRequest',
  async ({ 
    prayerRequestId, 
    userId, 
    userName, 
    message, 
    isAnonymous, 
    userProfilePic 
  }: { 
    prayerRequestId: string; 
    userId: string; 
    userName: string; 
    message: string; 
    isAnonymous?: boolean; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await prayerService.supportPrayerRequest(
        prayerRequestId, 
        userId, 
        userName, 
        message, 
        isAnonymous, 
        userProfilePic
      );
      if (result.success) {
        return prayerRequestId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTestimony = createAsyncThunk(
  'prayer/addTestimony',
  async ({ 
    prayerRequestId, 
    userId, 
    userName, 
    testimony, 
    userProfilePic 
  }: { 
    prayerRequestId: string; 
    userId: string; 
    userName: string; 
    testimony: string; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await prayerService.addTestimony(prayerRequestId, userId, userName, testimony, userProfilePic);
      if (result.success) {
        return result.id;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePrayerStatus = createAsyncThunk(
  'prayer/updateStatus',
  async ({ 
    prayerRequestId, 
    status 
  }: { 
    prayerRequestId: string; 
    status: 'active' | 'answered' | 'closed'; 
  }, { rejectWithValue }) => {
    try {
      const result = await prayerService.updatePrayerStatus(prayerRequestId, status);
      if (result.success) {
        return { prayerRequestId, status };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPrayerResponses = createAsyncThunk(
  'prayer/fetchResponses',
  async (prayerRequestId: string, { rejectWithValue }) => {
    try {
      const result = await prayerService.getPrayerResponses(prayerRequestId);
      if (result.success) {
        return result.responses;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePrayerInList: (state, action: PayloadAction<{ prayerId: string; updates: Partial<PrayerRequest> }>) => {
      const { prayerId, updates } = action.payload;
      
      // Update in requests array
      const requestIndex = state.requests.findIndex(prayer => prayer.id === prayerId);
      if (requestIndex !== -1) {
        state.requests[requestIndex] = { ...state.requests[requestIndex], ...updates };
      }
      
      // Update in myRequests array
      const myRequestIndex = state.myRequests.findIndex(prayer => prayer.id === prayerId);
      if (myRequestIndex !== -1) {
        state.myRequests[myRequestIndex] = { ...state.myRequests[myRequestIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Prayer Request
      .addCase(createPrayerRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPrayerRequest.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPrayerRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Prayer Requests
      .addCase(fetchPrayerRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrayerRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
        state.error = null;
      })
      .addCase(fetchPrayerRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch My Prayers
      .addCase(fetchMyPrayers.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      // Pray for Request
      .addCase(prayForRequest.fulfilled, (state, action) => {
        const prayerId = action.payload;
        
        // Increment prayer count
        const requestIndex = state.requests.findIndex(prayer => prayer.id === prayerId);
        if (requestIndex !== -1) {
          state.requests[requestIndex].prayerCount += 1;
        }
        
        const myRequestIndex = state.myRequests.findIndex(prayer => prayer.id === prayerId);
        if (myRequestIndex !== -1) {
          state.myRequests[myRequestIndex].prayerCount += 1;
        }
      })
      // Support Prayer Request
      .addCase(supportPrayerRequest.fulfilled, (state, action) => {
        const prayerId = action.payload;
        
        // Increment support count
        const requestIndex = state.requests.findIndex(prayer => prayer.id === prayerId);
        if (requestIndex !== -1) {
          state.requests[requestIndex].supportCount += 1;
        }
        
        const myRequestIndex = state.myRequests.findIndex(prayer => prayer.id === prayerId);
        if (myRequestIndex !== -1) {
          state.myRequests[myRequestIndex].supportCount += 1;
        }
      })
      // Update Prayer Status
      .addCase(updatePrayerStatus.fulfilled, (state, action) => {
        const { prayerRequestId, status } = action.payload;
        
        const requestIndex = state.requests.findIndex(prayer => prayer.id === prayerRequestId);
        if (requestIndex !== -1) {
          state.requests[requestIndex].status = status;
        }
        
        const myRequestIndex = state.myRequests.findIndex(prayer => prayer.id === prayerRequestId);
        if (myRequestIndex !== -1) {
          state.myRequests[myRequestIndex].status = status;
        }
      })
      // Fetch Prayer Responses
      .addCase(fetchPrayerResponses.fulfilled, (state, action) => {
        state.responses = action.payload;
      });
  },
});

export const { clearError, updatePrayerInList } = prayerSlice.actions;
export default prayerSlice.reducer;