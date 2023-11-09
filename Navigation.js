import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from './components/HomeScreen';
import DetailScreen from './components/DetailScreen';
import AddItem from './components/AddItem';
import AddCategory from './components/AddCategory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({

        tabBarLabel: () => null,
        tabBarStyle: {
          padding: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = 'list';
          } else if (route.name === 'AddItem') {
            iconName = 'plus';
          } else if (route.name === 'AddCategory') {
            iconName = 'folder-plus';
          }
          return <FontAwesome5 name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'grey',
      })}
    >
      <Tab.Screen name='HomeScreen' component={HomeScreen}  options={{ title: 'Personal Inventory' }}/>
      <Tab.Screen name='AddItem' component={AddItem} options={{ title: 'Add Item' }}/>
      <Tab.Screen name='AddCategory' component={AddCategory} options={{ title: 'Add Category' }}/>
      
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: null, headerBackTitle: '' }}
        />
      </Stack.Navigator>
      {/* <Drawer.Navigator initialRouteName="FilteredList">
        <Drawer.Screen name="FilteredList" component={FilteredListScreen} />
      </Drawer.Navigator> */}
    </NavigationContainer>
  );
};

export default Navigation;
