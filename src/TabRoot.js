import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Home from './screens/Home';
import Settings from './screens/Settings';
import FontAwesome from 'react-fontawesome';

export default createBottomTabNavigator(
  {
    Home,
    Settings,
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
