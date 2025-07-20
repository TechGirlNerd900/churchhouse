import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeedState, Post, Comment } from '../../types/feed';

const initialState: FeedState = {
  posts: [],
  isLoading: false,
  isRefreshing: false,
  hasMore: true,
  error: null,
  lastVisible: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<{ postId: string; updates: Partial<Post> }>) => {
      const { postId, updates } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    addComment: (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
      const { postId, comment } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].commentCount += 1;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setLastVisible: (state, action: PayloadAction<any>) => {
      state.lastVisible = action.payload;
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
  setPosts,
  addPost,
  updatePost,
  removePost,
  addComment,
  setLoading,
  setRefreshing,
  setHasMore,
  setLastVisible,
  setError,
  clearError,
} = feedSlice.actions;

export default feedSlice.reducer;