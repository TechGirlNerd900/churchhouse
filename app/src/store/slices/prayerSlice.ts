import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PrayerRequest } from '../../types';
import { prayerService } from '../../services/firebase/prayerService';

interface PrayerState {
  prayers: PrayerRequest[];
  myPrayers: PrayerRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: PrayerState = {
  prayers: [],
  myPrayers: [],
  loading: false,
  error: null,
};

export const fetchPrayers = createAsyncThunk(
  'prayer/fetchPrayers',
  async (_, { rejectWithValue }) => {
    try {
      const prayers = await prayerService.getPrayers();
      return prayers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPrayer = createAsyncThunk(
  'prayer/createPrayer',
  async (prayerData: Omit<PrayerRequest, 'id' | 'createdAt' | 'updatedAt' | 'prayersCount'>, { rejectWithValue }) => {
    try {
      const prayer = await prayerService.createPrayer(prayerData);
      return prayer;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    addPrayer: (state, action: PayloadAction<PrayerRequest>) => {
      state.prayers.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrayers.fulfilled, (state, action) => {
        state.prayers = action.payload;
        state.loading = false;
      })
      .addCase(createPrayer.fulfilled, (state, action) => {
        state.prayers.unshift(action.payload);
        state.myPrayers.unshift(action.payload);
      });
  },
});

export const { addPrayer } = prayerSlice.actions;
export default prayerSlice.reducer;