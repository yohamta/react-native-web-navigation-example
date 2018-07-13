import React from 'react';
import { AppRegistry, View, Dimensions } from 'react-native-web';
import TabRoot from './TabRoot';

const App = () => (
  <View style={{ height: Dimensions.get('window').height }}>
    <TabRoot />
  </View>
);

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });
