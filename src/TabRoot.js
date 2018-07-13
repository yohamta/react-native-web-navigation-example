import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { View, Text, StyleSheet } from 'react-native-web';
import Home from './screens/NewsList';
import Statistics from './screens/Statistics';
import FontAwesome from 'react-fontawesome';

export default createBottomTabNavigator(
  {
    Home,
    Statistics,
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const { routeName } = navigation.state;
        let name;
        if (routeName === 'Home') {
          name = 'home';
        } else {
          name = 'chart-bar'
        }
        return <FontAwesome name={name} style={{color: focused ? 'tomato': 'gray' }} />
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);
