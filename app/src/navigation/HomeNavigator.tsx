import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from '../types';
import FeedScreen from '../screens/home/FeedScreen';
import CreatePostScreen from '../screens/feed/CreatePostScreen';
import PostDetailsScreen from '../screens/feed/PostDetailsScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Feed"
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
        name="Feed" 
        component={FeedScreen}
        options={{ 
          title: 'Daily Bread',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen}
        options={{ 
          title: 'Share a Blessing',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="PostDetails" 
        component={PostDetailsScreen}
        options={{ title: 'Post' }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}