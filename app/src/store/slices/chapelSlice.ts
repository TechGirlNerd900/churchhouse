import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChapelState, Chapel, CreateChapelData, ChapelParticipant, ChapelMessage, AudioState } from '../../types/chapel';
import * as chapelService from '../../services/chapelService';

const initialState: ChapelState = {
  activeChapels: [],
  myChapels: [],
  currentChapel: null,
  participants: [],
  messages: [],
  isLoading: false,
  error: null,
  audioState: {
    isConnected: false,
    isMuted: true,
    isSpeaking: false,
    isHandRaised: false,
    audioLevel: 0,
  },
};

// Async thunks
export const createChapel = createAsyncThunk(
  'chapel/create',
  async ({ 
    chapelData, 
    hostId, 
    hostName, 
    hostProfilePic 
  }: { 
    chapelData: CreateChapelData; 
    hostId: string; 
    hostName: string; 
    hostProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await chapelService.createChapel(chapelData, hostId, hostName, hostProfilePic);
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

export const fetchActiveChapels = createAsyncThunk(
  'chapel/fetchActive',
  async (fellowshipId?: string, { rejectWithValue }) => {
    try {
      const result = await chapelService.getActiveChapels(fellowshipId);
      if (result.success) {
        return result.chapels;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinChapel = createAsyncThunk(
  'chapel/join',
  async ({ 
    chapelId, 
    userId, 
    userName, 
    userProfilePic 
  }: { 
    chapelId: string; 
    userId: string; 
    userName: string; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await chapelService.joinChapel(chapelId, userId, userName, userProfilePic);
      if (result.success) {
        return chapelId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveChapel = createAsyncThunk(
  'chapel/leave',
  async ({ chapelId, userId }: { chapelId: string; userId: string }, { rejectWithValue }) => {
    try {
      const result = await chapelService.leaveChapel(chapelId, userId);
      if (result.success) {
        return chapelId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const raiseHand = createAsyncThunk(
  'chapel/raiseHand',
  async ({ chapelId, userId }: { chapelId: string; userId: string }, { rejectWithValue }) => {
    try {
      const result = await chapelService.raiseHand(chapelId, userId);
      if (result.success) {
        return userId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const inviteToSpeak = createAsyncThunk(
  'chapel/inviteToSpeak',
  async ({ 
    chapelId, 
    userId, 
    inviterId 
  }: { 
    chapelId: string; 
    userId: string; 
    inviterId: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await chapelService.inviteToSpeak(chapelId, userId, inviterId);
      if (result.success) {
        return userId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chapel/sendMessage',
  async ({ 
    chapelId, 
    userId, 
    userName, 
    message, 
    type, 
    userProfilePic 
  }: { 
    chapelId: string; 
    userId: string; 
    userName: string; 
    message: string; 
    type?: 'text' | 'system' | 'prayer_request'; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await chapelService.sendChapelMessage(
        chapelId, 
        userId, 
        userName, 
        message, 
        type, 
        userProfilePic
      );
      if (result.success) {
        return { chapelId, message };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chapel/fetchMessages',
  async ({ chapelId, limit }: { chapelId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const result = await chapelService.getChapelMessages(chapelId, limit);
      if (result.success) {
        return result.messages;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchParticipants = createAsyncThunk(
  'chapel/fetchParticipants',
  async (chapelId: string, { rejectWithValue }) => {
    try {
      const result = await chapelService.getChapelParticipants(chapelId);
      if (result.success) {
        return result.participants;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const startChapel = createAsyncThunk(
  'chapel/start',
  async (chapelId: string, { rejectWithValue }) => {
    try {
      const result = await chapelService.startChapel(chapelId);
      if (result.success) {
        return chapelId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const endChapel = createAsyncThunk(
  'chapel/end',
  async (chapelId: string, { rejectWithValue }) => {
    try {
      const result = await chapelService.endChapel(chapelId);
      if (result.success) {
        return chapelId;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chapelSlice = createSlice({
  name: 'chapel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChapel: (state, action: PayloadAction<Chapel | null>) => {
      state.currentChapel = action.payload;
    },
    updateAudioState: (state, action: PayloadAction<Partial<AudioState>>) => {
      state.audioState = { ...state.audioState, ...action.payload };
    },
    addMessage: (state, action: PayloadAction<ChapelMessage>) => {
      state.messages.push(action.payload);
    },
    updateParticipant: (state, action: PayloadAction<{ userId: string; updates: Partial<ChapelParticipant> }>) => {
      const { userId, updates } = action.payload;
      const participantIndex = state.participants.findIndex(p => p.userId === userId);
      if (participantIndex !== -1) {
        state.participants[participantIndex] = { ...state.participants[participantIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Chapel
      .addCase(createChapel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChapel.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createChapel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Active Chapels
      .addCase(fetchActiveChapels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveChapels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeChapels = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveChapels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Join Chapel
      .addCase(joinChapel.fulfilled, (state) => {
        state.audioState.isConnected = true;
      })
      // Leave Chapel
      .addCase(leaveChapel.fulfilled, (state) => {
        state.currentChapel = null;
        state.participants = [];
        state.messages = [];
        state.audioState = {
          isConnected: false,
          isMuted: true,
          isSpeaking: false,
          isHandRaised: false,
          audioLevel: 0,
        };
      })
      // Fetch Messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      // Fetch Participants
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.participants = action.payload;
      })
      // Start Chapel
      .addCase(startChapel.fulfilled, (state, action) => {
        const chapelId = action.payload;
        const chapelIndex = state.activeChapels.findIndex(c => c.id === chapelId);
        if (chapelIndex !== -1) {
          state.activeChapels[chapelIndex].isLive = true;
          state.activeChapels[chapelIndex].startedAt = new Date();
        }
        if (state.currentChapel?.id === chapelId) {
          state.currentChapel.isLive = true;
          state.currentChapel.startedAt = new Date();
        }
      })
      // End Chapel
      .addCase(endChapel.fulfilled, (state, action) => {
        const chapelId = action.payload;
        const chapelIndex = state.activeChapels.findIndex(c => c.id === chapelId);
        if (chapelIndex !== -1) {
          state.activeChapels[chapelIndex].isLive = false;
          state.activeChapels[chapelIndex].endedAt = new Date();
        }
        if (state.currentChapel?.id === chapelId) {
          state.currentChapel.isLive = false;
          state.currentChapel.endedAt = new Date();
        }
      });
  },
});

export const { 
  clearError, 
  setCurrentChapel, 
  updateAudioState, 
  addMessage, 
  updateParticipant 
} = chapelSlice.actions;
export default chapelSlice.reducer;