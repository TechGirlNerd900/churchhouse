import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BibleStackParamList } from '../types';
import BibleScreen from '../screens/bible/BibleScreen';
import BibleReaderScreen from '../screens/bible/BibleReaderScreen';
import BookmarksScreen from '../screens/bible/BookmarksScreen';
import VerseDetailsScreen from '../screens/bible/VerseDetailsScreen';
import BibleSearchScreen from '../screens/bible/BibleSearchScreen';

const Stack = createStackNavigator<BibleStackParamList>();

export default function BibleNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BibleHome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: '#111827',
      }}
    >
      <Stack.Screen 
        name="BibleHome" 
        component={BibleScreen}
        options={{ 
          title: 'Bible',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="BibleReader" 
        component={BibleReaderScreen}
        options={{ title: 'Bible Reader' }}
      />
      <Stack.Screen 
        name="VerseDetails" 
        component={VerseDetailsScreen}
        options={{ title: 'Verse Details' }}
      />
      <Stack.Screen 
        name="BibleSearch" 
        component={BibleSearchScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen}
        options={{ title: 'Bookmarks' }}
      />
    </Stack.Navigator>
  );
}