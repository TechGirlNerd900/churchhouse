import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FellowshipState, Fellowship, FellowshipMember, FellowshipInvite } from '../../types/fellowship';

const initialState: FellowshipState = {
  fellowships: [],
  myFellowships: [],
  currentFellowship: null,
  members: [],
  invites: [],
  isLoading: false,
  error: null,
};

const fellowshipSlice = createSlice({
  name: 'fellowship',
  initialState,
  reducers: {
    setFellowships: (state, action: PayloadAction<Fellowship[]>) => {
      state.fellowships = action.payload;
    },
    setMyFellowships: (state, action: PayloadAction<Fellowship[]>) => {
      state.myFellowships = action.payload;
    },
    setCurrentFellowship: (state, action: PayloadAction<Fellowship | null>) => {
      state.currentFellowship = action.payload;
    },
    setMembers: (state, action: PayloadAction<FellowshipMember[]>) => {
      state.members = action.payload;
    },
    setInvites: (state, action: PayloadAction<FellowshipInvite[]>) => {
      state.invites = action.payload;
    },
    addFellowship: (state, action: PayloadAction<Fellowship>) => {
      state.fellowships.unshift(action.payload);
      state.myFellowships.unshift(action.payload);
    },
    updateFellowship: (state, action: PayloadAction<{ fellowshipId: string; updates: Partial<Fellowship> }>) => {
      const { fellowshipId, updates } = action.payload;
      const fellowshipIndex = state.fellowships.findIndex(f => f.id === fellowshipId);
      if (fellowshipIndex !== -1) {
        state.fellowships[fellowshipIndex] = { ...state.fellowships[fellowshipIndex], ...updates };
      }
      
      const myFellowshipIndex = state.myFellowships.findIndex(f => f.id === fellowshipId);
      if (myFellowshipIndex !== -1) {
        state.myFellowships[myFellowshipIndex] = { ...state.myFellowships[myFellowshipIndex], ...updates };
      }
      
      if (state.currentFellowship?.id === fellowshipId) {
        state.currentFellowship = { ...state.currentFellowship, ...updates };
      }
    },
    addMember: (state, action: PayloadAction<FellowshipMember>) => {
      state.members.push(action.payload);
    },
    removeInvite: (state, action: PayloadAction<string>) => {
      state.invites = state.invites.filter(invite => invite.id !== action.payload);
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
  setFellowships,
  setMyFellowships,
  setCurrentFellowship,
  setMembers,
  setInvites,
  addFellowship,
  updateFellowship,
  addMember,
  removeInvite,
  setLoading,
  setError,
  clearError,
} = fellowshipSlice.actions;

export default fellowshipSlice.reducer;