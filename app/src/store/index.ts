import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import feedSlice from './slices/feedSlice';
import chapelSlice from './slices/chapelSlice';
import bibleSlice from './slices/bibleSlice';
import prayerSlice from './slices/prayerSlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    feed: feedSlice,
    chapel: chapelSlice,
    bible: bibleSlice,
    prayer: prayerSlice,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.user.createdAt', 'auth.user.lastSeen'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;