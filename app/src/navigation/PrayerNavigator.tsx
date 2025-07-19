import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PrayerStackParamList } from '../types';
import PrayerListScreen from '../screens/prayer/PrayerListScreen';
import CreatePrayerScreen from '../screens/prayer/CreatePrayerScreen';
import PrayerDetailsScreen from '../screens/prayer/PrayerDetailsScreen';
import MyPrayersScreen from '../screens/prayer/MyPrayersScreen';

const Stack = createStackNavigator<PrayerStackParamList>();

export default function PrayerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="PrayerList"
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
        name="PrayerList" 
        component={PrayerListScreen}
        options={{ 
          title: 'Prayer Requests',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="CreatePrayer" 
        component={CreatePrayerScreen}
        options={{ 
          title: 'Share Prayer Request',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="PrayerDetails" 
        component={PrayerDetailsScreen}
        options={{ title: 'Prayer Request' }}
      />
      <Stack.Screen 
        name="MyPrayers" 
        component={MyPrayersScreen}
        options={{ title: 'My Prayers' }}
      />
    </Stack.Navigator>
  );
}