import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, Comment, CreatePostData, FeedState, PaginatedResponse } from '../../types';
import { feedService } from '../../services/feed/feedService';

const initialState: FeedState = {
  posts: [],
  loading: false,
  refreshing: false,
  hasMore: true,
  lastVisible: null,
  error: undefined,
};

// Async Thunks
export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async ({ refresh = false }: { refresh?: boolean } = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { feed: FeedState };
      const lastVisible = refresh ? null : state.feed.lastVisible;
      
      const response = await feedService.getFeed(lastVisible);
      return { ...response, refresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'feed/createPost',
  async (postData: CreatePostData, { rejectWithValue }) => {
    try {
      const post = await feedService.createPost(postData);
      return post;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'feed/likePost',
  async ({ postId, isLiked }: { postId: string; isLiked: boolean }, { rejectWithValue }) => {
    try {
      if (isLiked) {
        await feedService.unlikePost(postId);
      } else {
        await feedService.likePost(postId);
      }
      return { postId, isLiked: !isLiked };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sharePost = createAsyncThunk(
  'feed/sharePost',
  async ({ postId, content }: { postId: string; content?: string }, { rejectWithValue }) => {
    try {
      const sharedPost = await feedService.sharePost(postId, content);
      return sharedPost;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'feed/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await feedService.deletePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'feed/fetchComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const comments = await feedService.getComments(postId);
      return { postId, comments };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'feed/addComment',
  async ({ postId, content }: { postId: string; content: string }, { rejectWithValue }) => {
    try {
      const comment = await feedService.addComment(postId, content);
      return { postId, comment };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchPosts = createAsyncThunk(
  'feed/searchPosts',
  async ({ query, hashtag }: { query?: string; hashtag?: string }, { rejectWithValue }) => {
    try {
      const posts = await feedService.searchPosts(query, hashtag);
      return posts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.posts = [];
      state.hasMore = true;
      state.lastVisible = null;
      state.error = undefined;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    updatePostInFeed: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    removePostFromFeed: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    addPostToFeed: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Feed
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg?.refresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
        state.error = undefined;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        
        if (action.payload.refresh) {
          state.posts = action.payload.data;
        } else {
          state.posts = [...state.posts, ...action.payload.data];
        }
        
        state.hasMore = action.payload.hasMore;
        state.lastVisible = action.payload.nextCursor;
        state.error = undefined;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      });

    // Create Post
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.error = undefined;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Like Post
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, isLiked } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.isLiked = isLiked;
          post.likesCount += isLiked ? 1 : -1;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Share Post
    builder
      .addCase(sharePost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        
        // Update original post share count
        const originalPost = state.posts.find(p => p.id === action.payload.id);
        if (originalPost) {
          originalPost.sharesCount += 1;
        }
      })
      .addCase(sharePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete Post
    builder
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Add Comment
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.commentsCount += 1;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Search Posts
    builder
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        // For search results, we might want to handle differently
        // For now, we'll replace the current posts
        state.posts = action.payload;
        state.error = undefined;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearFeed,
  clearError,
  updatePostInFeed,
  removePostFromFeed,
  addPostToFeed,
  setRefreshing,
} = feedSlice.actions;

export default feedSlice.reducer;