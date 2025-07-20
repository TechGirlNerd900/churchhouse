import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BibleState, BibleVerse, BibleTranslation, BibleBook } from '../../types/bible';

const initialState: BibleState = {
  currentTranslation: {
    id: 'niv',
    name: 'New International Version',
    abbreviation: 'NIV',
    language: 'English',
    description: 'A contemporary English translation'
  },
  availableTranslations: [],
  books: [],
  currentChapter: null,
  bookmarks: [],
  notes: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

const bibleSlice = createSlice({
  name: 'bible',
  initialState,
  reducers: {
    setCurrentTranslation: (state, action: PayloadAction<BibleTranslation>) => {
      state.currentTranslation = action.payload;
    },
    setAvailableTranslations: (state, action: PayloadAction<BibleTranslation[]>) => {
      state.availableTranslations = action.payload;
    },
    setBooks: (state, action: PayloadAction<BibleBook[]>) => {
      state.books = action.payload;
    },
    setCurrentChapter: (state, action: PayloadAction<BibleState['currentChapter']>) => {
      state.currentChapter = action.payload;
    },
    setBookmarks: (state, action: PayloadAction<BibleState['bookmarks']>) => {
      state.bookmarks = action.payload;
    },
    setNotes: (state, action: PayloadAction<BibleState['notes']>) => {
      state.notes = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<BibleVerse[]>) => {
      state.searchResults = action.payload;
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
  setCurrentTranslation,
  setAvailableTranslations,
  setBooks,
  setCurrentChapter,
  setBookmarks,
  setNotes,
  setSearchResults,
  setLoading,
  setError,
  clearError,
} = bibleSlice.actions;

export default bibleSlice.reducer;
