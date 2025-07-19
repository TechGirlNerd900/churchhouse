import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChapelStackParamList } from '../types';
import ChapelListScreen from '../screens/chapel/ChapelListScreen';
import ChapelDetailsScreen from '../screens/chapel/ChapelDetailsScreen';
import CreateChapelScreen from '../screens/chapel/CreateChapelScreen';
import ChapelRoomScreen from '../screens/chapel/ChapelRoomScreen';

const Stack = createStackNavigator<ChapelStackParamList>();

export default function ChapelNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ChapelList"
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
        name="ChapelList" 
        component={ChapelListScreen}
        options={{ 
          title: 'Chapels',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="ChapelDetails" 
        component={ChapelDetailsScreen}
        options={{ title: 'Chapel' }}
      />
      <Stack.Screen 
        name="CreateChapel" 
        component={CreateChapelScreen}
        options={{ 
          title: 'Create Chapel',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="ChapelRoom" 
        component={ChapelRoomScreen}
        options={{ title: 'Chapel Room' }}
      />
    </Stack.Navigator>
  );
}