import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens here
import HomeScreen from './components/HomeScreen';
import DetailScreen from './components/DetailScreen';
import AddItem from './components/AddItem';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Inventory List" }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detail' }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItem}
          options={{ title: ' ' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
