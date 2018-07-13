import React from 'react';
import { AppRegistry, View, Dimensions } from 'react-native-web';
import { createRtdbLink } from 'apollo-link-firebase';
import firebase from 'firebase';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import NewsList from './screens/NewsList';
import TabRoot from './TabRoot';

var __DEV__ = false;

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBREgPNL0WplVZsfrhXAn8I8kcWKPR27ng',
    authDomain: 'news-app-73cf9.firebaseapp.com',
    databaseURL: 'https://news-app-73cf9.firebaseio.com',
    projectId: 'news-app-73cf9',
    storageBucket: 'news-app-73cf9.appspot.com',
    messagingSenderId: '432777027055',
  });
}

const rtdbLink = createRtdbLink({ database: firebase.database() });
const client = new ApolloClient({
  link: rtdbLink,
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <View style={{ height: Dimensions.get('window').height }}>
      <TabRoot />
    </View>
  </ApolloProvider>
);

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });
