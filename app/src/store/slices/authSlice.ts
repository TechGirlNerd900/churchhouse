import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences } from '../../types';
import { authService } from '../../services/firebase/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Async Thunks
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await authService.signInWithEmail(email, password);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ 
    email, 
    password, 
    displayName 
  }: { 
    email: string; 
    password: string; 
    displayName: string; 
  }, { rejectWithValue }) => {
    try {
      const user = await authService.signUpWithEmail(email, password, displayName);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.resetPassword(email);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<User>, { rejectWithValue }) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'auth/updatePreferences',
  async (preferences: Partial<UserPreferences>, { rejectWithValue }) => {
    try {
      const updatedUser = await authService.updatePreferences(preferences);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitialized = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign Up
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Preferences
    builder
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError, setLoading, setInitialized } = authSlice.actions;
export default authSlice.reducer;