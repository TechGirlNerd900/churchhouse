import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BibleState {
  // Define your bible state here
}

const initialState: BibleState = {
  // Initial state
};

const bibleSlice = createSlice({
  name: 'bible',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const { } = bibleSlice.actions;
export default bibleSlice.reducer;
