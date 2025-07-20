import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FeedState, Post, CreatePostData, Comment, FeedFilter } from '../../types/feed';
import * as feedService from '../../services/feedService';

const initialState: FeedState = {
  posts: [],
  isLoading: false,
  isRefreshing: false,
  hasMore: true,
  error: null,
  lastVisible: null,
};

// Async thunks
export const createPost = createAsyncThunk(
  'feed/createPost',
  async ({ 
    postData, 
    userId, 
    userName, 
    userProfilePic 
  }: { 
    postData: CreatePostData; 
    userId: string; 
    userName: string; 
    userProfilePic?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await feedService.createPost(postData, userId, userName, userProfilePic);
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

export const fetchPosts = createAsyncThunk(
  'feed/fetchPosts',
  async ({ 
    filter, 
    refresh = false 
  }: { 
    filter: FeedFilter; 
    refresh?: boolean; 
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { feed: FeedState };
      const lastVisible = refresh ? null : state.feed.lastVisible;
      
      const result = await feedService.getPosts(filter, lastVisible);
      if (result.success) {
        return {
          posts: result.posts,
          lastVisible: result.lastVisible,
          hasMore: result.hasMore,
          refresh,
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sharePost = createAsyncThunk(
  'feed/sharePost',
  async ({ 
    postId, 
    userId, 
    userName, 
    userProfilePic, 
    message 
  }: { 
    postId: string; 
    userId: string; 
    userName: string; 
    userProfilePic?: string; 
    message?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await feedService.sharePost(postId, userId, userName, userProfilePic, message);
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

export const addComment = createAsyncThunk(
  'feed/addComment',
  async ({ 
    postId, 
    userId, 
    userName, 
    text, 
    userProfilePic, 
    parentCommentId 
  }: { 
    postId: string; 
    userId: string; 
    userName: string; 
    text: string; 
    userProfilePic?: string; 
    parentCommentId?: string; 
  }, { rejectWithValue }) => {
    try {
      const result = await feedService.addComment(postId, userId, userName, text, userProfilePic, parentCommentId);
      if (result.success) {
        return { postId, commentId: result.id };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'feed/fetchComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const result = await feedService.getComments(postId);
      if (result.success) {
        return { postId, comments: result.comments };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFeed: (state) => {
      state.posts = [];
      state.lastVisible = null;
      state.hasMore = true;
      state.error = null;
    },
    updatePostInFeed: (state, action: PayloadAction<{ postId: string; updates: Partial<Post> }>) => {
      const { postId, updates } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
        // Optionally refresh feed after creating post
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Posts
      .addCase(fetchPosts.pending, (state, action) => {
        if (action.meta.arg.refresh) {
          state.isRefreshing = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        
        if (action.payload.refresh) {
          state.posts = action.payload.posts;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        
        state.lastVisible = action.payload.lastVisible;
        state.hasMore = action.payload.hasMore;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = action.payload as string;
      })
      // Share Post
      .addCase(sharePost.fulfilled, (state) => {
        // Optionally refresh feed or show success message
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].commentCount += 1;
        }
      });
  },
});

export const { clearError, resetFeed, updatePostInFeed } = feedSlice.actions;
export default feedSlice.reducer;