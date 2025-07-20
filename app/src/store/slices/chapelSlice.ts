import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChapelState, Chapel, ChapelParticipant, ChapelMessage, AudioState } from '../../types/chapel';

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
    isMuted: false,
    isSpeaking: false,
    isHandRaised: false,
    audioLevel: 0,
  },
};

const chapelSlice = createSlice({
  name: 'chapel',
  initialState,
  reducers: {
    setActiveChapels: (state, action: PayloadAction<Chapel[]>) => {
      state.activeChapels = action.payload;
    },
    setMyChapels: (state, action: PayloadAction<Chapel[]>) => {
      state.myChapels = action.payload;
    },
    setCurrentChapel: (state, action: PayloadAction<Chapel | null>) => {
      state.currentChapel = action.payload;
    },
    setParticipants: (state, action: PayloadAction<ChapelParticipant[]>) => {
      state.participants = action.payload;
    },
    setMessages: (state, action: PayloadAction<ChapelMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChapelMessage>) => {
      state.messages.push(action.payload);
    },
    setAudioState: (state, action: PayloadAction<Partial<AudioState>>) => {
      state.audioState = { ...state.audioState, ...action.payload };
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
  setActiveChapels,
  setMyChapels,
  setCurrentChapel,
  setParticipants,
  setMessages,
  addMessage,
  setAudioState,
  setLoading,
  setError,
  clearError,
} = chapelSlice.actions;

export default chapelSlice.reducer;