import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Package, Clock, MessageCircle } from 'lucide-react-native';

import DashboardScreen from './src/screens/DashboardScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SupportScreen from './src/screens/SupportScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#3b82f6',
              tabBarInactiveTintColor: '#9ca3af',
              headerStyle: {
                backgroundColor: '#ffffff',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Tab.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Home color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Products"
              component={ProductsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Package color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="History"
              component={HistoryScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Clock color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Support"
              component={SupportScreen}
              options={{
                tabBarIcon: ({ color, size}) => (
                  <MessageCircle color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
