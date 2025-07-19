import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, RootState } from './src/store';
import { useAppDispatch, useAppSelector } from './src/hooks/redux';
import { auth } from './src/services/firebase';
import { setUser, setInitialized } from './src/store/slices/authSlice';
import LoadingScreen from './src/components/common/LoadingScreen';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({
          id: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          isVerified: user.emailVerified,
          createdAt: new Date(user.metadata.creationTime || new Date().toISOString()),
          lastSeen: new Date(user.metadata.lastSignInTime || new Date().toISOString()),
          preferences: {
            notifications: {
              chapelInvites: true,
              prayerRequests: true,
              feedActivity: true,
              bibleReminders: true,
            },
            privacy: {
              profileVisibility: 'public',
              allowDirectMessages: true,
            },
            bible: {
              preferredTranslation: 'NIV',
              dailyVerseEnabled: true,
            },
          },
        }));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setInitialized(true));
    });

    return unsubscribe;
  }, [dispatch]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
