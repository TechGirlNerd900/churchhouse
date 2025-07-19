import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types';
import { COLORS } from '../constants';
import HomeNavigator from './HomeNavigator';
import BibleNavigator from './BibleNavigator';
import ChapelNavigator from './ChapelNavigator';
import PrayerNavigator from './PrayerNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Bible':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Chapels':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Prayer':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator}
        options={{ tabBarLabel: 'Daily Bread' }}
      />
      <Tab.Screen 
        name="Bible" 
        component={BibleNavigator}
        options={{ tabBarLabel: 'Bible' }}
      />
      <Tab.Screen 
        name="Chapels" 
        component={ChapelNavigator}
        options={{ tabBarLabel: 'Chapels' }}
      />
      <Tab.Screen 
        name="Prayer" 
        component={PrayerNavigator}
        options={{ tabBarLabel: 'Prayer' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}