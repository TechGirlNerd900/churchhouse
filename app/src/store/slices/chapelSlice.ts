import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChapelState {
  // Define your chapel state here
}

const initialState: ChapelState = {
  // Initial state
};

const chapelSlice = createSlice({
  name: 'chapel',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const { } = chapelSlice.actions;
export default chapelSlice.reducer;
