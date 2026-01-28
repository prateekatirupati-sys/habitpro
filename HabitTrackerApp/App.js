import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import ProductivityScreen from './src/screens/ProductivityScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Habits') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'Productivity') {
                iconName = focused ? 'timer' : 'timer-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: '#9ca3af',
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Dashboard' }}
          />
          <Tab.Screen 
            name="Habits" 
            component={HabitsScreen}
            options={{ title: 'My Habits' }}
          />
          <Tab.Screen 
            name="Productivity" 
            component={ProductivityScreen}
            options={{ title: 'Productivity' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
