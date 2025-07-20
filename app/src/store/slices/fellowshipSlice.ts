import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FellowshipState, Fellowship, CreateFellowshipData, FellowshipMember, FellowshipInvite, JoinFellowshipData } from '../../types/fellowship';
import * as fellowshipService from '../../services/fellowshipService';

const initialState: FellowshipState = {
  fellowships: [],
  myFellowships: [],
  currentFellowship: null,
  members: [],
  invites: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const createFellowship = createAsyncThunk(
  'fellowship/create',
  async ({ 
    fellowshipData, 
    founderId, 
    founderName, 
    founderProfilePic 
  }: { 
    fellowshipData: CreateFellowshipData; 
    founderId: string; 
    founderName: string; 
    founderProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.createFellowship(
        fellowshipData, 
        founderId, 
        founderName, 
        founderProfilePic
      );
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

export const fetchFellowships = createAsyncThunk(
  'fellowship/fetchAll',
  async ({ category, isPrivate }: { category?: string; isPrivate?: boolean }, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.getFellowships(category, isPrivate);
      if (result.success) {
        return result.fellowships;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyFellowships = createAsyncThunk(
  'fellowship/fetchMy',
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.getMyFellowships(userId);
      if (result.success) {
        return result.fellowships;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinFellowship = createAsyncThunk(
  'fellowship/join',
  async ({ 
    joinData, 
    userId, 
    userName, 
    userProfilePic 
  }: { 
    joinData: JoinFellowshipData; 
    userId: string; 
    userName: string; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.joinFellowship(joinData, userId, userName, userProfilePic);
      if (result.success) {
        return { fellowshipId: joinData.fellowshipId, requiresApproval: result.requiresApproval };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveFellowship = createAsyncThunk(
  'fellowship/leave',
  async ({ fellowshipId, userId }: { fellowshipId: string; userId: string }, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.leaveFellowship(fellowshipId, userId);
      if (result.success) {
        return fellowshipId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const inviteToFellowship = createAsyncThunk(
  'fellowship/invite',
  async ({ 
    fellowshipId, 
    inviterId, 
    inviterName, 
    inviteeId, 
    inviteeEmail, 
    message 
  }: { 
    fellowshipId: string; 
    inviterId: string; 
    inviterName: string; 
    inviteeId: string; 
    inviteeEmail?: string; 
    message?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.inviteToFellowship(
        fellowshipId, 
        inviterId, 
        inviterName, 
        inviteeId, 
        inviteeEmail, 
        message
      );
      if (result.success) {
        return fellowshipId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFellowshipMembers = createAsyncThunk(
  'fellowship/fetchMembers',
  async (fellowshipId: string, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.getFellowshipMembers(fellowshipId);
      if (result.success) {
        return result.members;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyInvites = createAsyncThunk(
  'fellowship/fetchMyInvites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.getMyFellowshipInvites(userId);
      if (result.success) {
        return result.invites;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const respondToInvite = createAsyncThunk(
  'fellowship/respondToInvite',
  async ({ 
    inviteId, 
    response, 
    userId, 
    userName, 
    userProfilePic 
  }: { 
    inviteId: string; 
    response: 'accepted' | 'declined'; 
    userId: string; 
    userName: string; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await fellowshipService.respondToFellowshipInvite(
        inviteId, 
        response, 
        userId, 
        userName, 
        userProfilePic
      );
      if (result.success) {
        return { inviteId, response };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const fellowshipSlice = createSlice({
  name: 'fellowship',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFellowship: (state, action: PayloadAction<Fellowship | null>) => {
      state.currentFellowship = action.payload;
    },
    updateFellowshipInList: (state, action: PayloadAction<{ fellowshipId: string; updates: Partial<Fellowship> }>) => {
      const { fellowshipId, updates } = action.payload;
      
      // Update in fellowships array
      const fellowshipIndex = state.fellowships.findIndex(f => f.id === fellowshipId);
      if (fellowshipIndex !== -1) {
        state.fellowships[fellowshipIndex] = { ...state.fellowships[fellowshipIndex], ...updates };
      }
      
      // Update in myFellowships array
      const myFellowshipIndex = state.myFellowships.findIndex(f => f.id === fellowshipId);
      if (myFellowshipIndex !== -1) {
        state.myFellowships[myFellowshipIndex] = { ...state.myFellowships[myFellowshipIndex], ...updates };
      }
      
      // Update current fellowship
      if (state.currentFellowship?.id === fellowshipId) {
        state.currentFellowship = { ...state.currentFellowship, ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Fellowship
      .addCase(createFellowship.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFellowship.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createFellowship.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Fellowships
      .addCase(fetchFellowships.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFellowships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fellowships = action.payload;
        state.error = null;
      })
      .addCase(fetchFellowships.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch My Fellowships
      .addCase(fetchMyFellowships.fulfilled, (state, action) => {
        state.myFellowships = action.payload;
      })
      // Join Fellowship
      .addCase(joinFellowship.fulfilled, (state, action) => {
        const { fellowshipId, requiresApproval } = action.payload;
        
        if (!requiresApproval) {
          // If no approval required, increment member count
          const fellowshipIndex = state.fellowships.findIndex(f => f.id === fellowshipId);
          if (fellowshipIndex !== -1) {
            state.fellowships[fellowshipIndex].memberCount += 1;
          }
        }
      })
      // Leave Fellowship
      .addCase(leaveFellowship.fulfilled, (state, action) => {
        const fellowshipId = action.payload;
        
        // Remove from myFellowships
        state.myFellowships = state.myFellowships.filter(f => f.id !== fellowshipId);
        
        // Decrement member count
        const fellowshipIndex = state.fellowships.findIndex(f => f.id === fellowshipId);
        if (fellowshipIndex !== -1) {
          state.fellowships[fellowshipIndex].memberCount -= 1;
        }
        
        // Clear current fellowship if it's the one we left
        if (state.currentFellowship?.id === fellowshipId) {
          state.currentFellowship = null;
        }
      })
      // Fetch Fellowship Members
      .addCase(fetchFellowshipMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      // Fetch My Invites
      .addCase(fetchMyInvites.fulfilled, (state, action) => {
        state.invites = action.payload;
      })
      // Respond to Invite
      .addCase(respondToInvite.fulfilled, (state, action) => {
        const { inviteId, response } = action.payload;
        
        // Update invite status
        const inviteIndex = state.invites.findIndex(i => i.id === inviteId);
        if (inviteIndex !== -1) {
          state.invites[inviteIndex].status = response;
        }
      });
  },
});

export const { clearError, setCurrentFellowship, updateFellowshipInList } = fellowshipSlice.actions;
export default fellowshipSlice.reducer;